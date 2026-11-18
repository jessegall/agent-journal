<?php

declare(strict_types=1);

namespace App\Hooks\Stack;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Enums\ActorType;
use App\Agents\Contracts\CurrentSession;
use App\Agents\Exceptions\AgentContextMissing;
use App\Bus\Contracts\StackAdmission;
use App\Bus\Exceptions\StackLockTimedOut;
use App\Bus\Support\OperationDeadline;
use Closure;
use Illuminate\Database\DatabaseManager;
use Illuminate\Database\QueryException;

/**
 * Admission to a session's stack as a PostgreSQL session advisory lock in the journal's own namespace, taken in
 * autocommit before the operation's transaction and waited for at most the deadline's lock wait. Inside a transaction
 * that is already open it takes no lock, so no repeatable-read snapshot ever waits for one. A connection that cannot
 * give the lock back is disconnected, never reused.
 */
final class AdvisoryStackAdmission implements StackAdmission
{
    /**
     * The first key of every stack lock, so no other advisory lock of the database meets it.
     */
    public const int NAMESPACE = 410_016;

    private const string LOCK_NOT_AVAILABLE = '55P03';

    /**
     * @var array<string, true>
     */
    private array $admitted = [];

    public function __construct(
        private readonly DatabaseManager $databases,
        private readonly CurrentActor $actors,
        private readonly CurrentSession $session,
    ) {}

    public function admit(string $sessionId, OperationDeadline $deadline, Closure $work): mixed
    {
        $connection = $this->databases->connection();

        if (isset($this->admitted[$sessionId]) || $connection->transactionLevel() > 0) {
            return $work();
        }

        $this->lock($sessionId, $deadline);
        $this->admitted[$sessionId] = true;

        try {
            return $work();
        } finally {
            unset($this->admitted[$sessionId]);
            $this->unlock($sessionId);
        }
    }

    /**
     * Only a signed agent call has a session stack to admit: a user, the system, the engine, or an agent acting outside
     * a signed request runs as it is.
     */
    public function admitCaller(OperationDeadline $deadline, Closure $work): mixed
    {
        if (! $this->actors->isSignedIn() || $this->actors->actor()->type !== ActorType::Agent) {
            return $work();
        }

        try {
            $sessionId = $this->session->sessionId();
        } catch (AgentContextMissing) {
            return $work();
        }

        return $this->admit($sessionId, $deadline, $work);
    }

    /**
     * @throws StackLockTimedOut
     */
    private function lock(string $sessionId, OperationDeadline $deadline): void
    {
        $connection = $this->databases->connection();
        $connection->statement("SET lock_timeout = '{$deadline->lockMilliseconds()}ms'");

        try {
            $connection->select('SELECT pg_advisory_lock(?, hashtext(?))', [self::NAMESPACE, $sessionId]);
        } catch (QueryException $failure) {
            if ($failure->getCode() === self::LOCK_NOT_AVAILABLE) {
                throw StackLockTimedOut::held($deadline->lockMilliseconds(), $failure);
            }

            throw $failure;
        } finally {
            $connection->statement('RESET lock_timeout');
        }
    }

    private function unlock(string $sessionId): void
    {
        $connection = $this->databases->connection();
        $released = $connection->selectOne('SELECT pg_advisory_unlock(?, hashtext(?)) AS released', [self::NAMESPACE, $sessionId]);

        if ($released?->released !== true) {
            $connection->disconnect();
        }
    }
}
