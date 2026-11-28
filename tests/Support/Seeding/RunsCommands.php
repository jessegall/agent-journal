<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Accounts\Enums\CommandEntry;
use App\Actors\ActorStore;
use App\Bus\CommandEntrance;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\JournalCommands as JournalCommandsContract;
use App\Bus\JournalCommands;
use App\Bus\OutsideCommandAllowance;
use App\Bus\RequestKey;
use App\Support\CommandRegistry;
use Closure;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestStart;

/**
 * How the journal fixture sends a command: on the bus as the actor in place, keyed or not, or as the journal itself
 * through a trusted entry; each gives the command's own result back and leaves the actor in place selected.
 */
trait RunsCommands
{
    /**
     * Runs the command as the actor in place under a request key of its own, or the one given to send it again, and
     * forgets the key afterwards, as the web's middleware does after each request.
     *
     * @template TResult
     *
     * @param  Command<TResult>  $command
     * @return TResult
     */
    public function run(Command $command, string|null $requestKey = null): mixed
    {
        $key = $this->app->make(RequestKey::class);
        $key->set($requestKey ?? (string) Str::ulid());

        try {
            return $this->refusingOutsideWrites(fn (): mixed => $this->app->make(CommandBus::class)->run($command));
        } finally {
            $key->forget();
        }
    }

    /**
     * Runs the work as the actor in place under one request key of its own, as a request that calls a service which
     * sends its commands does, and forgets the key afterwards.
     *
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function keyed(Closure $work): mixed
    {
        $key = $this->app->make(RequestKey::class);
        $key->set((string) Str::ulid());

        try {
            return $work();
        } finally {
            $key->forget();
        }
    }

    /**
     * Runs the command as the actor in place with no request key at all.
     *
     * @template TResult
     *
     * @param  Command<TResult>  $command
     * @return TResult
     */
    public function runUnkeyed(Command $command): mixed
    {
        return $this->refusingOutsideWrites(fn (): mixed => $this->app->make(CommandBus::class)->run($command));
    }

    /**
     * Runs the command unkeyed as the agent and session of a start the test made itself.
     *
     * @template TResult
     *
     * @param  Command<TResult>  $command
     * @return TResult
     */
    public function runAsStart(TestStart $start, Command $command): mixed
    {
        $this->requests->asAgent($start->agent->id, $start->session->id);

        return $this->runUnkeyed($command);
    }

    /**
     * Runs the command as the journal itself does, from the entry and under the trusted entry its listener names, and
     * puts the actor in place back afterwards.
     *
     * @template TResult
     *
     * @param  Command<TResult>  $command
     * @return TResult
     */
    public function runAsJournal(CommandEntry $entry, string $trustedEntry, Command $command): mixed
    {
        try {
            return $this->refusingOutsideWrites(
                fn (): mixed => $this->app->make(JournalCommandsContract::class)->runAsJournal(
                    $entry,
                    $trustedEntry,
                    $command,
                ),
            );
        } finally {
            $this->requests->reselect();
        }
    }

    /**
     * Runs a trusted entry's command as the system, through the command's own entry.
     *
     * @template TResult
     *
     * @param  Command<TResult>  $command
     * @return TResult
     */
    public function throughEntry(Command $command): mixed
    {
        $entry = $this->app->make(CommandRegistry::class)->entryOf($command::class);
        $dispatcher = $this->app->make(JournalCommands::class)->for($entry);
        $actors = $this->app->make(ActorStore::class);

        return $this->refusingOutsideWrites(
            fn (): mixed => $actors->actAsSystem('test', fn (): mixed => $dispatcher->run($command)),
        );
    }

    /**
     * Runs the work as the system inside the entry, as a listener of a command that arrived there runs: the commands it
     * sends pass that entry's check.
     *
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function runInside(CommandEntry $entry, Closure $work): mixed
    {
        $entrance = $this->app->make(CommandEntrance::class);
        $actors = $this->app->make(ActorStore::class);

        return $actors->actAsSystem('test', fn (): mixed => $entrance->through($entry, $work));
    }

    /**
     * The same as throughEntry() on a request of its own: the scoped instances are forgotten before and after it, so
     * neither the last request nor the next one shares its actor, and the actor the journal had in place comes back.
     *
     * @template TResult
     *
     * @param  Command<TResult>  $command
     * @return TResult
     */
    public function asSystem(Command $command): mixed
    {
        $this->app->forgetScopedInstances();

        try {
            return $this->throughEntry($command);
        } finally {
            $this->app->forgetScopedInstances();
            $this->requests->reselect();
        }
    }

    /**
     * Runs the command as the owner of the journal under a new request key, as a fixture arranges, and puts the
     * selection back after.
     *
     * @template TResult
     *
     * @param  Command<TResult>  $command
     * @return TResult
     */
    public function asOwner(Command $command): mixed
    {
        $owner = $this->ownerUser();

        return $this->requests->during(fn () => $this->requests->asUser($owner), fn () => $this->run($command));
    }

    /**
     * Runs the work as the running app does, where a write outside a command is refused.
     *
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    private function refusingOutsideWrites(Closure $work): mixed
    {
        return $this->app->make(OutsideCommandAllowance::class)->forbidDuring($work);
    }
}
