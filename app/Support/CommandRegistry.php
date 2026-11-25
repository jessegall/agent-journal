<?php

declare(strict_types=1);

namespace App\Support;

use App\Attributes\Authorize;
use App\Contracts\Bus\PipelineRunner;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Engine\CommandAdmissionStage;
use App\Enums\Reviews\CommandEffectType;
use App\Pipes\CheckCommandHandlers;
use App\Pipes\CheckCommandMiddleware;
use App\Pipes\CheckExportedCommands;
use App\Pipes\ReadCommandHandlers;
use App\Pipes\RegisterCommands;
use App\Values\EffectiveCommand;
use PhpOption\None;

/**
 * Every registered command with its handler, owner and middleware, checked once at start-up so a wrong declaration
 * stops the application before any command runs. It holds class names and values only.
 */
final readonly class CommandRegistry
{
    /**
     * @param  array<class-string, RegisteredCommand>  $commands
     */
    private function __construct(private array $commands) {}

    /**
     * Checks every owner's commands, handlers and middleware in these steps and refuses the first wrong declaration.
     *
     * @param  list<CommandOwner>  $owners  Core first, then the domains in bootstrap/domains.php order
     */
    public static function from(array $owners, PipelineRunner $runner): self
    {
        return $runner->runSteps(
            [
                ReadCommandHandlers::class,
                CheckCommandHandlers::class,
                CheckExportedCommands::class,
                CheckCommandMiddleware::class,
                RegisterCommands::class,
            ],
            new CommandDeclarations($owners),
            self::class,
        );
    }

    /**
     * The registry of commands the steps checked.
     *
     * @param  array<class-string, RegisteredCommand>  $commands
     */
    public static function of(array $commands): self
    {
        return new self($commands);
    }

    public function has(string $command): bool
    {
        return isset($this->commands[$command]);
    }

    /**
     * Each command with its handler, as Laravel's dispatcher maps them.
     *
     * @return array<class-string, class-string>
     */
    public function handlerMap(): array
    {
        return array_map(fn (RegisteredCommand $entry) => $entry->handler, $this->commands);
    }

    /**
     * @return class-string
     */
    public function handlerOf(string $command): string
    {
        return $this->entry($command)->handler;
    }

    /**
     * The policy and access an application command declares; null for a trusted command.
     */
    public function authorizeOf(string $command): Authorize|null
    {
        return $this->entry($command)->authorize;
    }

    /**
     * The entry the command belongs to; an application command unless it declares a trusted one.
     */
    public function entryOf(string $command): CommandEntry
    {
        return $this->entry($command)->entry;
    }

    public function ownerOf(string $command): string
    {
        return $this->entry($command)->owner;
    }

    public function isExported(string $command): bool
    {
        return $this->entry($command)->isExported;
    }

    public function isRepeatableReadNeeded(string $command): bool
    {
        return $this->entry($command)->isRepeatableRead;
    }

    public function effectOf(string $command): CommandEffectType
    {
        return $this->entry($command)->effect;
    }

    public function effective(CommandCall $call, CommandAdmissionStage $stage): EffectiveCommand
    {
        $registered = $this->entry($call->name());

        return new EffectiveCommand($call->command(), $registered->effect, $registered->authorize, $stage);
    }

    public function requiresRequestKey(string $command): bool
    {
        return $this->entry($command)->requiresRequestKey;
    }

    public function retentionOf(string $command): ReceiptRetention
    {
        return $this->entry($command)->retention;
    }

    /**
     * Whether the command keeps its receipts for the actor across sessions, rather than for one session.
     */
    public function hasActorScopedReceipt(string $command): bool
    {
        return $this->entry($command)->isActorScopedReceipt;
    }

    /**
     * The module middleware a command passes, in order: by stage, then owner order, then declaration order.
     *
     * @return list<RegisteredMiddleware>
     */
    public function middlewareFor(string $command): array
    {
        return $this->entry($command)->middleware;
    }

    /**
     * The Laravel rules of each ruled property, the type rule first; empty when the command declares none.
     *
     * @return array<string, list<string|object>>
     */
    public function rulesFor(string $command): array
    {
        return $this->entry($command)->rules;
    }

    private function entry(string $command): RegisteredCommand
    {
        return $this->commands[$command];
    }
}
