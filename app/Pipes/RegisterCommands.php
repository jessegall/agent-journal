<?php

declare(strict_types=1);

namespace App\Pipes;

use App\Contracts\Bus\Pipe;
use App\Enums\MiddlewareStage;
use App\Support\CommandDeclarations;
use App\Support\CommandRegistry;
use App\Support\DeclaredCommand;
use App\Support\PropertyRules;
use App\Support\RegisteredCommand;
use App\Support\RegisteredMiddleware;

/**
 * Registers every checked command with its handler, owner, attributes, property rules and the middleware it passes,
 * ordered by stage, then owner order, then declaration order.
 */
final readonly class RegisterCommands implements Pipe
{
    public function __construct(private PropertyRules $propertyRules) {}

    public function handle(CommandDeclarations $declarations): CommandRegistry
    {
        $registered = [];

        foreach ($declarations->commands as $declared) {
            $registered[$declared->command] = new RegisteredCommand(
                handler: $declared->handler,
                owner: $declared->owner->name,
                exported: $declared->owner->exportsCommand($declared->command),
                repeatableRead: $declared->isRepeatableReadNeeded(),
                effect: $declared->effect(),
                requiresRequestKey: $declared->isRequestKeyRequired(),
                actorScopedReceipt: $declared->hasActorScopedReceipt(),
                retention: $declared->retention(),
                middleware: $this->middlewareFor($declared, $declarations),
                rules: $this->propertyRules->of($declared->declaration()),
                authorize: $declared->authorize,
                entry: $declared->entry,
            );
        }

        return CommandRegistry::of($registered);
    }

    /**
     * @return list<RegisteredMiddleware>
     */
    private function middlewareFor(DeclaredCommand $declared, CommandDeclarations $declarations): array
    {
        $order = array_flip(array_map(static fn ($one) => $one->name, $declarations->owners));

        $applying = array_values(array_filter(
            $declarations->middleware,
            static fn (RegisteredMiddleware $entry) => $entry->appliesTo(
                $declared->command,
                $declared->owner->domainClass,
            ),
        ));

        $position = array_flip(array_keys($applying));

        // Stage first, then the owner's place, then the declaration's place, as one whole number to sort by.
        $rank = static fn (RegisteredMiddleware $entry) => (
            $entry->runsIn(MiddlewareStage::BeforeTransaction) ? 0 : 1_000_000_000
        )
            + $order[$entry->owner] * 100_000
            + $position[array_search($entry, $applying, true)];

        usort(
            $applying,
            static fn (RegisteredMiddleware $one, RegisteredMiddleware $other) => $rank($one) <=> $rank($other),
        );

        return $applying;
    }
}
