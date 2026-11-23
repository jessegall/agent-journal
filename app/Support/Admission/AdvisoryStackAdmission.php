<?php

declare(strict_types=1);

namespace App\Support\Admission;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Admission\StackAdmission;
use App\Contracts\Authorization\EngineTargetAccess;
use App\Contracts\Work\WorkStacks;
use App\Support\OperationDeadline;
use App\Support\SessionAdvisoryLocks;
use App\Support\StateEvents\StateEventScope;
use App\Values\StackTarget;
use Closure;
use Illuminate\Database\DatabaseManager;

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

    /**
     * @var array<string, true>
     */
    private array $admitted = [];

    public function __construct(
        private readonly DatabaseManager $databases,
        private readonly SessionAdvisoryLocks $locks,
        private readonly WorkStacks $workStacks,
        private readonly CurrentActor $actors,
        private readonly EngineTargetAccess $engine,
        private readonly StateEventScope $eventScope,
    ) {}

    public function admit(string $sessionId, OperationDeadline $deadline, Closure $work): mixed
    {
        $connection = $this->databases->connection();

        if (isset($this->admitted[$sessionId]) || $connection->transactionLevel() > 0) {
            return $work();
        }

        $this->locks->lock(self::NAMESPACE, $sessionId, $deadline);
        $this->admitted[$sessionId] = true;

        try {
            return $work();
        } finally {
            unset($this->admitted[$sessionId]);
            $this->locks->unlock(self::NAMESPACE, $sessionId);
        }
    }

    /**
     * Admits the operation to the stacks its actor works on, in sorted order, before its transaction opens; an
     * actor that works on no stack runs as it is.
     */
    public function admitCaller(OperationDeadline $deadline, Closure $work): mixed
    {
        $sessions = $this->workStacks->sessionsToAdmit();
        $admitted = fn () => $this->withEventTargets($sessions, $work);

        foreach (array_reverse($sessions) as $sessionId) {
            $inner = $admitted;
            $admitted = fn () => $this->admit($sessionId, $deadline, $inner);
        }

        return $admitted();
    }

    /**
     * @template TResult
     *
     * @param  list<string>  $sessions
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    private function withEventTargets(array $sessions, Closure $work): mixed
    {
        if (! $this->actors->hasActor()) {
            return $this->eventScope->admit([], $work);
        }

        $actor = $this->actors->actor();

        $grant = $this->engine->frameGrantFor($actor);

        if ($grant->isDefined()) {
            return $this->eventScope->admitFrame($grant->get(), $work);
        }

        $targets = array_map(fn (string $session) => new StackTarget($actor->id, $session), $sessions);

        return $this->eventScope->admit($targets, $work);
    }
}
