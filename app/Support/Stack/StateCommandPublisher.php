<?php

declare(strict_types=1);

namespace App\Support\Stack;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Bus\Command;
use App\Contracts\Bus\CommandFacts;
use App\Contracts\Events\Event;
use App\Events\Hooks\StateCommandAnswered;
use App\Support\Projects\ProjectSelectionStore;
use App\Values\StackTarget;

/**
 * Publishes a command a state answered with, to run under the change's actor and authority once the change commits:
 * a hook's answer, or the lifecycle moments of a change made outside a hook walk or a fact's delivery.
 */
final readonly class StateCommandPublisher
{
    public function __construct(
        private CommandFacts $facts,
        private CurrentActor $actors,
        private ProjectSelectionStore $projects,
    ) {}

    /**
     * @param  Command<mixed>  $command
     */
    public function publish(StackTarget $target, Command $command): void
    {
        $this->facts->publishAfterCommit(
            new StateCommandAnswered($target, $command, $this->actors->actor(), $this->actors->authority()),
        );
    }

    /**
     * Runs the lifecycle moments of a change on its states under the target agent's project, then publishes the
     * commands and raises the events they answered with; the caller saves the frames after, with the changed values.
     */
    public function publishMoments(StackTarget $target, StackSnapshot $before, AgentStack $after): void
    {
        $effects = $this->projects->forTarget($target, fn (): array => $after->lifecycleEffectsSince($before));

        foreach ($effects as $effect) {
            if ($effect instanceof Event) {
                $this->facts->publishAfterCommit($effect);

                continue;
            }

            $this->publish($target, $effect);
        }
    }
}
