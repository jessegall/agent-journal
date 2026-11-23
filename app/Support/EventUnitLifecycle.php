<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Events\Event;
use App\Contracts\Events\FactStaging;
use App\Contracts\Work\UnitOfWork;
use App\Exceptions\EventUnitRefused;
use Closure;
use Illuminate\Database\ConnectionInterface;
use Throwable;

/**
 * What a transaction owner does with its event unit: open a fresh one with the transaction, drain the required work
 * and refuse a failed unit before commit, mark the batch ready once after the known commit, erase everything on
 * rollback, and detach the unit on every exit; a committed unit goes to the publication. A command joining the
 * transaction drains its required work before it returns and marks the unit failed when a failure crosses it.
 */
final readonly class EventUnitLifecycle implements CommandFacts, UnitOfWork
{
    public function __construct(
        private ActiveEventUnits $units,
        private TransactionListenerDrain $drain,
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
    public function run(
        ConnectionInterface $connection,
        string $owner,
        Closure $work,
        Closure $commit,
        Closure $rollBack,
    ): mixed {
        $unit = $this->units->open($connection);

        try {
            $result = $work();
            $this->drain->runTransactionListeners($unit);

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
    public function join(ConnectionInterface $connection, Closure $work): mixed
    {
        $active = $this->units->activeFor($connection);

        if ($active->isEmpty()) {
            return $work();
        }

        $unit = $active->get();

        try {
            return $unit->runNested(function () use ($work, $unit): mixed {
                $result = $work();
                $this->drain->runTransactionListeners($unit);

                return $result;
            });
        } catch (Throwable $failure) {
            $unit->markFailed();

            throw $failure;
        }
    }

    public function runTransactionListeners(): void
    {
        $this->units->activeFor($this->database)->forAll(
            fn (EventUnit $unit) => $this->drain->runTransactionListeners($unit),
        );
    }

    /**
     * Sends a fact through the unit's owner-ordered stream, in its place among the facts the models raise, released
     * after the commit; outside a unit its transaction listeners run and it goes out at once. It takes a command-level
     * fact whose transaction listeners must run in the transaction, and an occurrence a transaction listener stages; a
     * plain dispatch is heard after the commit too, through the app's dispatcher, but runs no transaction listener.
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
        $this->drain->runTransactionListeners($unit);

        return $result;
    }
}
