<?php

declare(strict_types=1);

namespace App\Support\Stack;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Bus\Command;
use App\Contracts\Bus\CommandFacts;
use App\Contracts\Events\Event;
use App\Events\StateCommandAnswered;
use App\Values\StackTarget;

/**
 * Publishes a command a state answered with, to run under the change's actor and authority once the change commits:
 * a hook's answer, or the lifecycle moments of a change made outside a hook walk or a fact's delivery.
 */
final readonly class StateCommandPublisher
{
    public function __construct(private CommandFacts $facts, private CurrentActor $actors) {}

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
     * Publishes the commands and raises the events the states answer the lifecycle moments of a change with.
     */
    public function publishMoments(StackTarget $target, StackSnapshot $before, AgentStack $after): void
    {
        foreach ($after->lifecycleEffectsSince($before) as $effect) {
            if ($effect instanceof Event) {
                $this->facts->publishAfterCommit($effect);

                continue;
            }

            $this->publish($target, $effect);
        }
    }
}
