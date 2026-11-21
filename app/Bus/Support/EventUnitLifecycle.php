<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Bus\Exceptions\EventUnitRefused;
use Closure;
use Illuminate\Database\ConnectionInterface;
use Throwable;

/**
 * What a transaction owner does with its event unit: open a fresh one with the transaction, drain the required work
 * and refuse a failed unit before commit, mark the batch ready once after the known commit, erase everything on
 * rollback, and detach the unit on every exit; a committed unit goes to the publication. A command joining the
 * transaction drains its required work before it returns and marks the unit failed when a failure crosses it.
 */
final readonly class EventUnitLifecycle
{
    public function __construct(
        private ActiveEventUnits $units,
        private RequiredDrain $drain,
        private Publication $publication,
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
    public function own(ConnectionInterface $connection, string $owner, Closure $work, Closure $commit, Closure $rollBack): mixed
    {
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
            $this->publication->committed($unit);

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
        $unit = $this->units->activeFor($connection);

        try {
            $result = $work();

            if ($unit !== null) {
                $this->drain->applyRequired($unit);
            }

            return $result;
        } catch (Throwable $failure) {
            $unit?->markFailed();

            throw $failure;
        }
    }
}
