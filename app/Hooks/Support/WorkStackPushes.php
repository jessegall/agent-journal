<?php

declare(strict_types=1);

namespace App\Hooks\Support;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\WorkStacks;
use App\Actors\Support\ActorIdentity;
use App\Agents\Support\StackTarget;
use App\Hooks\Actions\AddressedStackPush;
use App\Hooks\Contracts\ActorWorkStacks;
use App\Hooks\Contracts\AgentStack;
use App\Hooks\Contracts\CurrentState;
use App\Hooks\Decisions\StateReference;
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

    public function current(string $typeKey): Option
    {
        $target = $this->targets()[0] ?? null;

        return $target === null ? None::create() : $this->states->of($target, $typeKey);
    }

    public function currentRecord(): Option
    {
        return Option::fromValue($this->targets()[0] ?? null)->flatMap($this->states->record(...));
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
