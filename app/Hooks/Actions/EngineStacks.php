<?php

declare(strict_types=1);

namespace App\Hooks\Actions;

use App\Agents\Exceptions\StackTargetRefused;
use App\Agents\Models\AgentSession;
use App\Agents\Support\StackTarget;
use App\Hooks\Contracts\EngineTargetAccess;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Lifecycle\FrameLifecycle;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Stack\StackRestorer;
use App\Hooks\Stack\StatePush;
use App\Hooks\Stack\StateTypes;
use App\Hooks\Support\StackTransaction;

/**
 * The engine's pushes: inside the handler's transaction, only onto the target its grant covers, with the target's
 * session read and held running before the stack is locked, then through the one shared push.
 */
final readonly class EngineStacks
{
    public function __construct(
        private StackTransaction $transaction,
        private EngineTargetAccess $access,
        private StatePush $statePush,
        private StackRestorer $restorer,
        private FrameLifecycle $lifecycle,
        private StateTypes $types,
    ) {}

    public function push(StackTarget $target, StateReference $reference): void
    {
        $this->transaction->requireOpen($target);
        $this->access->checkTarget($target);

        if (! AgentSession::sharedLockFor($target->sessionId)->isActive()) {
            throw StackTargetRefused::forTarget($target->description());
        }

        $row = AgentStackRow::lockAuthorizedFor($target);
        $this->statePush->push($target, $row, $reference);
    }

    /**
     * The explicit top-pop outside a walk; a closed stack is left as it is.
     */
    public function popExposed(StackTarget $target): void
    {
        $this->transaction->requireOpen($target);
        $this->access->checkTarget($target);
        $this->lifecycle->refuseChangeDuringCallbacks($target);
        $row = AgentStackRow::lockKeptFor(AgentStackRow::query()->authorizedFor($target), $target);

        if (! $row->isActive()) {
            return;
        }

        $before = $this->restorer->restore($row->frames);
        $after = $before->withoutExposedInactive();

        if ($after->frameIds() === $before->frameIds()) {
            return;
        }

        $this->lifecycle->settle($target, $before, $after);
        $row->saveFrames($after->records(), $this->types->ticking());
    }
}
