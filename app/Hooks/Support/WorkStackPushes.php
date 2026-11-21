<?php

declare(strict_types=1);

namespace App\Hooks\Support;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\WorkStacks;
use App\Actors\Support\ActorIdentity;
use App\Agents\Values\StackTarget;
use App\Hooks\Actions\AddressedStackPush;
use App\Hooks\Contracts\ActorWorkStacks;
use App\Hooks\Contracts\AgentStack;
use App\Hooks\Contracts\CurrentState;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Models\AgentStackRow;
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
            $this->stacks->push($target, $state);
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
