<?php

declare(strict_types=1);

namespace App\Bus\CommandMiddleware;

use App\Actors\Contracts\CurrentActor;
use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Enums\CommandEntry;
use App\Bus\Exceptions\CommandNotRegistered;
use App\Bus\Support\CommandCall;
use App\Bus\Support\CommandEntrance;
use App\Bus\Support\CommandNesting;
use App\Bus\Support\CommandRegistry;
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
        $outsideItsEntry = ! $this->entrance->admits($entry);
        $followsItsParent = $entry === CommandEntry::Application && $this->nesting->isNested();

        if ($outsideItsEntry && ! $followsItsParent) {
            throw CommandNotRegistered::for($call->name());
        }

        if ($entry === CommandEntry::Application && ! $followsItsParent && ! $this->mayRunApplicationCommands()) {
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
