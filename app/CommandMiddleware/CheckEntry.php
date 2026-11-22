<?php

declare(strict_types=1);

namespace App\CommandMiddleware;

use App\Contracts\CommandMiddleware;
use App\Contracts\CurrentActor;
use App\Enums\CommandEntry;
use App\Exceptions\CommandNotRegistered;
use App\Support\CommandCall;
use App\Support\CommandEntrance;
use App\Support\CommandNesting;
use App\Support\CommandRegistry;
use Closure;

/**
 * Before the transaction, a command runs only through its own entry: a trusted entry's command only when that entry
 * dispatched it, so the public transports answer it as an unknown command whoever acts, and an application command
 * not from a trusted entry's own work, so the journal acting through one never runs it at the top level. A command a
 * handler dispatches follows the one that dispatched it.
 */
final readonly class CheckEntry implements CommandMiddleware
{
    public function __construct(
        private CommandRegistry $registry,
        private CommandEntrance $entrance,
        private CommandNesting $nesting,
        private CurrentActor $actors,
    ) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        $entry = $this->registry->entryOf($call->name());

        if ($entry === CommandEntry::Application && $this->entrance->current() === CommandEntry::EngineMaintenance) {
            throw CommandNotRegistered::for($call->name());
        }

        $hasDisallowedEntry = ! $this->entrance->admits($entry);
        $isNestedApplicationCall = $entry === CommandEntry::Application && $this->nesting->isNested();

        if ($hasDisallowedEntry && ! $isNestedApplicationCall) {
            throw CommandNotRegistered::for($call->name());
        }

        if ($entry === CommandEntry::Application
            && ! $isNestedApplicationCall
            && ! $this->mayRunApplicationCommands()
        ) {
            throw CommandNotRegistered::for($call->name());
        }

        return $next($call);
    }

    /**
     * An actor's own authority decides, unless trusted work opened the application's entrance for its commands.
     */
    private function mayRunApplicationCommands(): bool
    {
        if ($this->entrance->isOpenedForApplication() || ! $this->actors->hasActor()) {
            return true;
        }

        return $this->actors->authority()->mayRunApplicationCommands();
    }
}
