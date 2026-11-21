<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Bus\Contracts\CommandFacts;
use App\Bus\Contracts\FactStaging;
use App\Bus\Contracts\UnitOwner;
use App\Bus\Exceptions\EventUnitRefused;
use App\Contracts\Event;
use Closure;
use Illuminate\Database\ConnectionInterface;
use Throwable;

/**
 * What a transaction owner does with its event unit: open a fresh one with the transaction, drain the required work
 * and refuse a failed unit before commit, mark the batch ready once after the known commit, erase everything on
 * rollback, and detach the unit on every exit; a committed unit goes to the publication. A command joining the
 * transaction drains its required work before it returns and marks the unit failed when a failure crosses it.
 */
final readonly class EventUnitLifecycle implements CommandFacts, UnitOwner
{
    public function __construct(
        private ActiveEventUnits $units,
        private RequiredDrain $drain,
        private Publication $publication,
        private ConnectionInterface $database,
        private FactStaging $staging,
    ) {}

    /**
     * Runs one physical transaction's work in a fresh unit; $commit runs the physical commit after the checks.
     *
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @param  Closure(): void  $commit
     * @param  Closure(): void  $rollBack
     * @return TResult
     */
    public function own(
        ConnectionInterface $connection,
        string $owner,
        Closure $work,
        Closure $commit,
        Closure $rollBack,
    ): mixed {
        $unit = $this->units->open($connection);

        try {
            $result = $work();
            $this->drain->applyRequired($unit);

            if ($unit->hasFailed()) {
                throw EventUnitRefused::failedBeforeCommit($owner);
            }

            $unit->seal();
            $commit();
            $unit->markReady();
            $this->units->close($connection);
            $this->publication->takeCommitted($unit);

            return $result;
        } catch (Throwable $failure) {
            if (! $unit->isReady()) {
                $rollBack();
                $unit->erase();
            }

            throw $failure;
        } finally {
            $this->units->close($connection);
        }
    }

    /**
     * Runs a command inside the transaction already open: its required work is drained before it returns, and a
     * failure crossing it marks the unit failed. With no unit open the command runs as before.
     *
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function within(ConnectionInterface $connection, Closure $work): mixed
    {
        $active = $this->units->activeFor($connection);

        if ($active->isEmpty()) {
            return $work();
        }

        $unit = $active->get();

        try {
            return $unit->runNested(function () use ($work, $unit): mixed {
                $result = $work();
                $this->drain->applyRequired($unit);

                return $result;
            });
        } catch (Throwable $failure) {
            $unit->markFailed();

            throw $failure;
        }
    }

    public function applyRequired(): void
    {
        $this->units->activeFor($this->database)->forAll(fn (EventUnit $unit) => $this->drain->applyRequired($unit));
    }

    /**
     * Sends a fact through the unit's owner-ordered stream, in its place among the facts the models raise, released
     * after the commit; outside a unit its required listeners run and it goes out at once. It takes the facts delivered after the commit: an event
     * marked ShouldDispatchAfterCommit, a send in an afterCommit closure, a command-level fact and an occurrence a
     * required listener stages. A plain dispatch whose listeners write in the transaction is not one of them, and an
     * afterCommit job keeps Laravel's own after-commit dispatch.
     */
    public function publishAfterCommit(Event $event): void
    {
        $active = $this->units->activeFor($this->database);

        if ($active->isEmpty()) {
            $this->drain->applyNow($event);
            $this->staging->deliver($event, null);

            return;
        }

        $active->get()->stage($event);
    }

    /**
     * Runs an operation whose facts wait until it ends: what its own saves raise is drained only when it returns,
     * after the work it does on the way, and dropped when it throws. Outside a unit the work runs as before.
     *
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function holdUntilReturn(Closure $work): mixed
    {
        $active = $this->units->activeFor($this->database);

        if ($active->isEmpty()) {
            return $work();
        }

        $unit = $active->get();
        $result = $unit->hold($work);
        $this->drain->applyRequired($unit);

        return $result;
    }
}
