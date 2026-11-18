<?php

declare(strict_types=1);

namespace App\Hooks\Actions;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Enums\ActorType;
use App\Agents\Support\StackTarget;
use App\Hooks\Contracts\StackCleanup;
use App\Hooks\Lifecycle\FrameLifecycle;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Stack\StackRestorer;
use App\Hooks\Support\StackAccess;
use App\Hooks\Support\StackTransaction;

/**
 * Settles one stack after its work ended: the finished frames leave, their exits run, and the frame that comes back on
 * top resumes, all in the caller's transaction. A closed stack is kept as it is.
 */
final readonly class StackCleanups implements StackCleanup
{
    public function __construct(
        private StackTransaction $transaction,
        private CurrentActor $actors,
        private StackAccess $access,
        private StackRestorer $restorer,
        private FrameLifecycle $lifecycle,
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
        $row->saveFrames($after->records());
    }

    /**
     * The target's stack, open or closed, locked once the caller may settle it: an agent only its own stack, a user
     * the stack it was authorized for. Any other actor, or none, is refused.
     */
    private function lockedRowFor(StackTarget $target): AgentStackRow
    {
        return match ($this->actors->actor()->actorType()) {
            ActorType::Agent => $this->ownRow($target),
            ActorType::User => AgentStackRow::lockKeptFor(AgentStackRow::query()->authorizedFor($target), $target),
        };
    }

    private function ownRow(StackTarget $target): AgentStackRow
    {
        $this->access->checkTarget($target);

        return AgentStackRow::lockKeptFor(AgentStackRow::query()->forTarget($target), $target);
    }
}
