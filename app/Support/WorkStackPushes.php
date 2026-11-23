<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\ActorWorkStacks;
use App\Contracts\Actors\CurrentActor;
use App\Contracts\Work\AgentStack;
use App\Contracts\Work\CurrentState;
use App\Contracts\Work\WorkStacks;
use App\Models\Agents\AgentStackRow;
use App\Support\References\StateReference;
use App\Values\StackTarget;
use PhpOption\None;
use PhpOption\Option;

/**
 * Pushes onto each stack the work-stack binding names for the acting actor.
 */
final readonly class WorkStackPushes implements ActorWorkStacks
{
    public function __construct(
        private WorkStacks $workStacks,
        private CurrentActor $actors,
        private AgentStack $stacks,
        private CurrentState $states,
        private AddressedStackPush $addressed,
    ) {}

    public function push(StateReference $state): void
    {
        foreach ($this->targets() as $target) {
            $this->stacks->activate($target, $state);
        }
    }

    public function pushFor(ActorIdentity $actor, StateReference $state): void
    {
        foreach ($this->workStacks->sessionsOf($actor) as $sessionId) {
            $this->addressed->push(new StackTarget($actor->id, $sessionId), $state);
        }
    }

    public function offerFor(ActorIdentity $actor, StateReference $state): void
    {
        $rows = AgentStackRow::lockActiveOf($actor, $this->workStacks->sessionsOf($actor));
        $this->addressed->offer($rows, $state);
    }

    public function pruneCurrent(): void
    {
        foreach ($this->targets() as $target) {
            $this->addressed->prune($target);
        }
    }

    public function current(string $typeKey): Option
    {
        $target = $this->targets()[0] ?? null;

        return $target === null ? None::create() : $this->states->of($target, $typeKey);
    }

    public function currentRecord(): Option
    {
        $target = $this->targets()[0] ?? null;

        return $target === null ? None::create() : $this->states->record($target);
    }

    /**
     * @return list<StackTarget>
     */
    private function targets(): array
    {
        $actorId = $this->actors->actor()->actorId();

        return array_map(
            fn (string $sessionId) => new StackTarget($actorId, $sessionId),
            $this->workStacks->sessionsToAdmit(),
        );
    }
}
