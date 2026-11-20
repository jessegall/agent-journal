<?php

declare(strict_types=1);

namespace App\Hooks\Support;

use App\Agents\Support\StackTarget;
use App\Bus\Contracts\StackAdmission;
use App\Bus\Exceptions\StackLockTimedOut;
use App\Bus\Support\OperationDeadline;
use App\Contracts\StartTransaction;
use App\Hooks\Contracts\RunsStackTransactions;
use App\Hooks\Contracts\StackTransactionRunner;
use App\Hooks\Exceptions\StackTransactionRequired;
use App\Hooks\StateEvents\StateEventScope;
use Closure;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Database\QueryException;

/**
 * Runs one stack operation in one transaction with a lock and statement time limit set first, before any write.
 * Inside a transaction that already has its limits it joins that transaction and leaves the limits as they are.
 */
final readonly class StackTransaction implements RunsStackTransactions, StackTransactionRunner, StartTransaction
{
    private const string LOCK_NOT_AVAILABLE = '55P03';

    private const string QUERY_CANCELED = '57014';

    public function __construct(
        private ConnectionInterface $database,
        private OperationDeadline $deadline,
        private StackAdmission $admission,
        private StateEventScope $eventScope,
    ) {}

    /**
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function run(Closure $work): mixed
    {
        return $this->runWithin($this->deadline, $work);
    }

    public function runForSession(string $sessionId, Closure $work): mixed
    {
        return $this->runAdmitted($sessionId, $this->deadline, $work);
    }

    /**
     * Runs the work for one session's stack: admitted to the stack first, then in its transaction, both within the
     * deadline.
     *
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function runAdmitted(string $sessionId, OperationDeadline $deadline, Closure $work): mixed
    {
        return $this->admission->admit($sessionId, $deadline, fn () => $this->runWithin($deadline, $work));
    }

    /**
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function runAdmittedForTarget(StackTarget $target, OperationDeadline $deadline, Closure $work): mixed
    {
        return $this->runAdmitted(
            $target->sessionId,
            $deadline,
            fn () => $this->eventScope->admit([$target], $work),
        );
    }

    /**
     * @template TResult
     *
     * @param  list<StackTarget>  $targets  In admission order.
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function runForTargets(array $targets, Closure $work): mixed
    {
        $run = fn () => $this->run($work);

        foreach (array_reverse($targets) as $target) {
            $inner = $run;
            $run = fn () => $this->admission->admit($target->sessionId, $this->deadline, $inner);
        }

        return $run();
    }

    /**
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function runWithin(OperationDeadline $deadline, Closure $work): mixed
    {
        if ($this->database->transactionLevel() > 0) {
            $this->checkLimitsAreSet();

            return $work();
        }

        try {
            return $this->database->transaction(function () use ($deadline, $work): mixed {
                $this->database->statement("SET LOCAL lock_timeout = '{$deadline->lockMilliseconds()}ms'");
                $this->database->statement("SET LOCAL statement_timeout = '{$deadline->milliseconds}ms'");

                return $work();
            });
        } catch (QueryException $failure) {
            if (in_array($failure->getCode(), [self::LOCK_NOT_AVAILABLE, self::QUERY_CANCELED], true)) {
                throw StackLockTimedOut::after($deadline->milliseconds, $failure);
            }

            throw $failure;
        }
    }

    /**
     * Refuses a stack change outside a transaction, so it can only commit together with the work that caused it.
     */
    public function requireOpen(StackTarget $target): void
    {
        if ($this->database->transactionLevel() === 0) {
            throw StackTransactionRequired::forTarget($target->description());
        }
    }

    private function checkLimitsAreSet(): void
    {
        if ($this->database->scalar("SELECT current_setting('lock_timeout')") === '0') {
            throw StackTransactionRequired::withoutLimits();
        }
    }
}
