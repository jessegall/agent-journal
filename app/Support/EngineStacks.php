<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Authorization\EngineTargetAccess;
use App\Exceptions\StackTargetRefused;
use App\Models\Agents\AgentSession;
use App\Models\Agents\AgentStackRow;
use App\Support\Mutations\StatePush;
use App\Support\References\StateReference;
use App\Support\Stack\AgentStack;
use App\Support\Stack\StackRestorer;
use App\Support\Stack\StateTypes;
use App\Values\StackTarget;

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
        private StateTypes $types,
    ) {}

    public function push(StackTarget $target, StateReference $reference): void
    {
        $this->transaction->assertOpen($target);
        $this->access->assertTargetGranted($target);

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
        $this->transaction->assertOpen($target);
        $this->access->assertTargetGranted($target);
        $row = AgentStackRow::lockKeptFor(AgentStackRow::query()->authorizedFor($target), $target);

        if (! $row->isActive()) {
            return;
        }

        $before = $this->restorer->restore($row->frames, $row->target);
        $after = $before->withoutExposedInactive();

        if ($after->frameIds() === $before->frameIds()) {
            return;
        }

        $row->saveFrames($after->records(), $this->types->ticking());
    }

    /**
     * Saves the stack's frames again when a listener changed a state's own values, under the caller's stack
     * transaction, so the next restore hands them back.
     */
    public function keepValues(StackTarget $target, AgentStack $stack): void
    {
        $this->transaction->assertOpen($target);
        $after = $stack->records();

        AgentStackRow::lockActiveAuthorizedFor($target)
            ->filter(fn (AgentStackRow $row) => ! $row->frames->hasSameValuesAs($after))
            ->forAll(fn (AgentStackRow $row) => $row->saveFrames($after, $this->types->ticking()));
    }
}
