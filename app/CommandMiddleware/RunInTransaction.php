<?php

declare(strict_types=1);

namespace App\CommandMiddleware;

use App\Contracts\Bus\CommandMiddleware;
use App\Exceptions\CommandRetryExhausted;
use App\Exceptions\CommandTransactionMismatch;
use App\Exceptions\NestedCommandFailureIgnored;
use App\Exceptions\StackLockTimedOut;
use App\Support\ActiveEventUnits;
use App\Support\CommandCall;
use App\Support\CommandStops;
use App\Support\EventUnitLifecycle;
use App\Support\OperationDeadline;
use App\Support\OuterTransactionOwner;
use App\Support\RunningCommand;
use App\Support\ScopedReadMeter;
use Closure;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Database\QueryException;

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
        private EventUnitLifecycle $lifecycle,
        private ActiveEventUnits $units,
        private OuterTransactionOwner $outerOwner,
    ) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        if ($this->database->transactionLevel() > 0) {
            $isolation = $this->requireJoinable($call);

            if (! $this->running->isRunning() && $this->isUnownedOuterTransaction()) {
                return $this->lifecycle->own(
                    $this->database,
                    $call->name(),
                    fn () => $this->running->running($call, $isolation, fn () => $next($call)),
                    fn () => null,
                    fn () => null,
                );
            }

            // The first command inside a stack transaction is the running command; later ones join it.
            return $this->lifecycle->within($this->database, fn () => $this->running->isRunning()
                ? $this->running->joined($call, fn () => $next($call))
                : $this->running->running($call, $isolation, fn () => $next($call)));
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
        $isolation = $call->isRepeatableReadNeeded() ? self::REPEATABLE_READ : self::READ_COMMITTED;
        $this->database->beginTransaction();

        return $this->lifecycle->own(
            $this->database,
            $call->name(),
            function () use ($call, $next, $deadline, $isolation): mixed {
                $this->database->statement('SET TRANSACTION ISOLATION LEVEL '.strtoupper($isolation));
                $this->database->statement("SET LOCAL lock_timeout = '{$deadline->lockMilliseconds()}ms'");
                $this->database->statement("SET LOCAL statement_timeout = '{$deadline->milliseconds}ms'");
                $commandReply = $this->running->running($call, $isolation, fn () => $next($call));
                $failed = $this->running->failedJoinedCommand();

                if ($failed !== null) {
                    throw NestedCommandFailureIgnored::for($call->name(), $failed);
                }

                return $commandReply;
            },
            fn () => $this->database->commit(),
            fn () => $this->database->rollBack(),
        );
    }

    /**
     * Whether the open transaction is the registered outer owner's with no unit yet, so this command owns one.
     */
    private function isUnownedOuterTransaction(): bool
    {
        return $this->outerOwner->isRegistered() && $this->units->activeFor($this->database)->isEmpty();
    }

    /**
     * A command joins only a transaction of its own isolation that has its lock and statement limits (table 6.6); the
     * answer is that isolation.
     */
    private function requireJoinable(CommandCall $call): string
    {
        $needed = $call->isRepeatableReadNeeded() ? self::REPEATABLE_READ : self::READ_COMMITTED;
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
