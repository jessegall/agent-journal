<?php

declare(strict_types=1);

namespace App\Hooks\Actions;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Enums\ActorType;
use App\Agents\Exceptions\StackTargetRefused;
use App\Agents\Support\StackTarget;
use App\Hooks\Contracts\EngineTargetAccess;
use App\Hooks\Contracts\StackCleanup;
use App\Hooks\Contracts\WorkedOnStack;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Lifecycle\FrameLifecycle;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Stack\StackRestorer;
use App\Hooks\Stack\StateTypes;
use App\Hooks\Support\StackTransaction;
use Closure;

/**
 * Settles one stack after its work ended: the finished frames leave, their exits run, and the frame that comes back on
 * top resumes, all in the caller's transaction. A closed stack is kept as it is.
 */
final readonly class StackCleanups implements StackCleanup
{
    /**
     * The most stacks one record's work is settled on at once; a record is worked on by a handful of sessions at most.
     */
    private const int STACKS_PER_RECORD = 50;

    public function __construct(
        private StackTransaction $transaction,
        private CurrentActor $actors,
        private StackRestorer $restorer,
        private FrameLifecycle $lifecycle,
        private StateTypes $types,
        private EngineTargetAccess $engineAccess,
    ) {}

    public function removeFinished(StackTarget $target): void
    {
        $this->transaction->requireOpen($target);
        $this->lifecycle->refuseChangeDuringCallbacks($target);
        $row = $this->lockedRowFor($target);

        if (! $row->isActive()) {
            return;
        }

        $before = $this->restorer->restore($row->frames, $row->frames->role());
        $after = $before->withoutFinishedFrames();

        if ($after->frameIds() === $before->frameIds()) {
            return;
        }

        $this->lifecycle->settle($target, $before, $after);
        $row->saveFrames($after->records(), $this->types->ticking());
    }

    public function endWork(WorkedOnStack $record, Closure $change): void
    {
        $holding = $this->stacksHolding($record->workState());
        $change($record);

        foreach ($holding as $target) {
            $this->removeFinished($target);
        }
    }

    /**
     * The stacks the actor may settle whose frames hold the state, in agent then session order: an agent its own,
     * a user any.
     *
     * @return list<StackTarget>
     */
    private function stacksHolding(StateReference $state): array
    {
        $actor = $this->actors->actor();
        $rows = AgentStackRow::query()
            ->holdingState($state)
            ->when($actor->actorType() === ActorType::Agent, fn ($query) => $query->where('agent_id', $actor->actorId()))
            ->orderBy('agent_id')
            ->orderBy('session_id')
            ->readLimit(self::STACKS_PER_RECORD)
            ->get();

        return array_values($rows->map(fn (AgentStackRow $row) => new StackTarget($row->agent_id, $row->session_id))->all());
    }

    /**
     * The target's stack, open or closed, locked once the caller may settle it: an agent any stack of its own, in
     * whichever session its work was started, a user the stack it was authorized for, the engine the stack its grant
     * covers. The system, any other actor, or none, is refused.
     */
    private function lockedRowFor(StackTarget $target): AgentStackRow
    {
        $actor = $this->actors->actor();

        if ($actor->actorType() === ActorType::Engine) {
            $this->engineAccess->checkTarget($target);
        }

        if (match ($actor->actorType()) {
            ActorType::Agent => $actor->actorId() !== $target->agentId,
            ActorType::User => false,
            ActorType::System => true,
            ActorType::Engine => false,
        }) {
            throw StackTargetRefused::forTarget($target->description());
        }

        return AgentStackRow::lockKeptFor(AgentStackRow::query()->authorizedFor($target), $target);
    }
}
