<?php

declare(strict_types=1);

namespace App\Bus\CommandMiddleware;

use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Exceptions\CommandRetryExhausted;
use App\Bus\Exceptions\CommandTransactionMismatch;
use App\Bus\Exceptions\NestedCommandFailureIgnored;
use App\Bus\Exceptions\StackLockTimedOut;
use App\Bus\Support\CommandCall;
use App\Bus\Support\CommandStops;
use App\Bus\Support\OperationDeadline;
use App\Bus\Support\RunningCommand;
use App\Reads\Support\ScopedReadMeter;
use Closure;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Database\QueryException;
use Throwable;

/**
 * The one place a command transaction starts (doc 19, sections 6.5 and 6.6). With none open it begins one in the
 * command's isolation with lock and statement limits, and reruns the whole attempt on a serialization failure or a
 * deadlock, three attempts at most; with one open it joins it after checking the isolation, with no savepoint.
 */
final readonly class RunInTransaction implements CommandMiddleware
{
    private const int ATTEMPTS = 3;

    private const array RETRIED_CODES = ['40001', '40P01'];

    private const array TIMED_OUT_CODES = ['55P03', '57014'];

    private const string READ_COMMITTED = 'read committed';

    private const string REPEATABLE_READ = 'repeatable read';

    public function __construct(
        private ConnectionInterface $database,
        private OperationDeadline $deadline,
        private RunningCommand $running,
        private CommandStops $stops,
    ) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        if ($this->database->transactionLevel() > 0) {
            $isolation = $this->requireJoinable($call);

            // The first command inside a stack transaction is the running command; later ones join it.
            return $this->running->isRunning()
                ? $this->running->joined($call, fn () => $next($call))
                : $this->running->running($call, $isolation, fn () => $next($call));
        }

        for ($attempt = 1; ; $attempt++) {
            $deadline = $this->stops->limit($this->deadline);

            if ($deadline->hasRunOut()) {
                throw StackLockTimedOut::spent(-$deadline->milliseconds);
            }

            try {
                return $attempt === 1
                    ? $this->attempt($call, $next, $deadline)
                    : ScopedReadMeter::ofCurrentScope()->withinSchedule(
                        'transaction retry',
                        fn () => $this->attempt($call, $next, $deadline),
                    );
            } catch (QueryException $failure) {
                if (in_array($failure->getCode(), self::TIMED_OUT_CODES, true)) {
                    throw StackLockTimedOut::after($deadline->milliseconds, $failure);
                }

                if (! in_array($failure->getCode(), self::RETRIED_CODES, true)) {
                    throw $failure;
                }

                if ($attempt === self::ATTEMPTS || $this->deadline->hasRunOut()) {
                    throw CommandRetryExhausted::for($call->name(), $attempt, previous: $failure);
                }
            }
        }
    }

    /**
     * One attempt, its lock and statement limits set from the time this attempt has.
     */
    private function attempt(CommandCall $call, Closure $next, OperationDeadline $deadline): mixed
    {
        $isolation = $call->needsRepeatableRead() ? self::REPEATABLE_READ : self::READ_COMMITTED;
        $this->database->beginTransaction();

        try {
            $this->database->statement('SET TRANSACTION ISOLATION LEVEL '.strtoupper($isolation));
            $this->database->statement("SET LOCAL lock_timeout = '{$deadline->lockMilliseconds()}ms'");
            $this->database->statement("SET LOCAL statement_timeout = '{$deadline->milliseconds}ms'");
            $commandReply = $this->running->running($call, $isolation, fn () => $next($call));
            $failed = $this->running->failedJoinedCommand();

            if ($failed !== null) {
                throw NestedCommandFailureIgnored::for($call->name(), $failed);
            }

            $this->database->commit();

            return $commandReply;
        } catch (Throwable $failure) {
            $this->database->rollBack();

            throw $failure;
        }
    }

    /**
     * A command joins only a transaction of its own isolation that has its lock and statement limits (table 6.6); the
     * answer is that isolation.
     */
    private function requireJoinable(CommandCall $call): string
    {
        $needed = $call->needsRepeatableRead() ? self::REPEATABLE_READ : self::READ_COMMITTED;
        $open = $this->running->isolation() ?? (string) $this->database->scalar('SHOW transaction_isolation');

        if (! $this->running->isRunning() && $this->openTransactionHasNoLimits()) {
            throw CommandTransactionMismatch::for(
                $call->name(),
                'the open transaction has no lock and statement limits; open it through the bus or the stack transaction',
            );
        }

        if ($open !== $needed) {
            $outer = $this->running->name() ?? 'code outside the bus';

            throw CommandTransactionMismatch::for(
                $call->name(),
                "it needs {$needed} and the transaction {$outer} opened is {$open}",
            );
        }

        return $open;
    }

    private function openTransactionHasNoLimits(): bool
    {
        return $this->database->scalar("SELECT current_setting('lock_timeout')") === '0';
    }
}
