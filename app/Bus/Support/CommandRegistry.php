<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Bus\Enums\CommandEntry;
use App\Bus\Pipes\CheckCommandHandlers;
use App\Bus\Pipes\CheckCommandMiddleware;
use App\Bus\Pipes\CheckExportedCommands;
use App\Bus\Pipes\ReadCommandHandlers;
use App\Bus\Pipes\RegisterCommands;
use App\Pipelines\Contracts\PipelineRunner;
use PhpOption\Option;

/**
 * Every registered command with its handler, owner and middleware, checked once at start-up so a wrong declaration
 * stops the application before any command runs (doc 19, section 6.1). It holds class names and values only.
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
    public static function from(array $owners, PipelineRunner $pipelines): self
    {
        return $pipelines->runSteps(
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
     * The policy and ability the command declared; none while it declares no Authorize yet.
     *
     * @return Option<CommandAuthorization>
     */
    public function authorizationOf(string $command): Option
    {
        return Option::fromValue($this->entry($command)->authorization);
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
        return $this->entry($command)->exported;
    }

    public function needsRepeatableRead(string $command): bool
    {
        return $this->entry($command)->repeatableRead;
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
        return $this->entry($command)->actorScopedReceipt;
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
