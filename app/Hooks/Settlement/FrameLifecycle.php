<?php

declare(strict_types=1);

namespace App\Hooks\Settlement;

use App\Actors\Contracts\CurrentActor;
use App\Agents\Values\StackTarget;
use App\Bus\Contracts\CommandFacts;
use App\Hooks\Enums\LifecycleStage;
use App\Hooks\Events\LifecycleAnswersSettled;
use App\Hooks\Exceptions\StackChangedInLifecycle;
use App\Hooks\Exceptions\StackTooDeep;
use App\Hooks\Stack\AgentStack;
use App\Hooks\StateEvents\StateEventActivity;
use Illuminate\Container\Attributes\Scoped;

/**
 * Calls the lifecycle methods a committed stack change asks for, from the frames before and after it, compared by
 * frame id: exits of the removed frames top down, enters of the added frames bottom up, then a resume of the final
 * top when it was already there but covered. It is the one place a frame newly settles on a stack.
 */
#[Scoped]
final class FrameLifecycle
{
    /**
     * @var array<string, true> the stacks whose lifecycle methods are running, keyed by target
     */
    private array $running = [];

    public function __construct(
        private readonly StateEventActivity $eventActivity,
        private readonly CommandFacts $facts,
        private readonly CurrentActor $actors,
    ) {}

    /**
     * @throws StackTooDeep when the stack after the change holds more frames than a stack may
     */
    public function settle(StackTarget $target, AgentStack $before, AgentStack $after): void
    {
        if (count($after->frames()) > AgentStack::DEPTH_LIMIT) {
            throw StackTooDeep::for($target->description(), AgentStack::DEPTH_LIMIT);
        }

        $removed = $before->framesMissingFrom($after);
        $added = $after->framesMissingFrom($before);
        $resumed = $after->topResumedSince($before);
        $runningBefore = $this->running;
        $this->running[self::keyOf($target)] = true;

        $answers = new LifecycleAnswers($target);

        try {
            $callbacks = function () use ($target, $removed, $added, $resumed, $answers): void {
                foreach (array_reverse($removed) as $frame) {
                    $answers->add($frame, LifecycleStage::Exit, $frame->exit($target));
                }

                foreach ($added as $frame) {
                    $answers->add($frame, LifecycleStage::Enter, $frame->enter($target));
                }

                if ($resumed !== null) {
                    $answers->add($resumed, LifecycleStage::Resume, $resumed->resume($target));
                }
            };

            $this->eventActivity->evaluate($target, $callbacks);
        } finally {
            $this->running = $runningBefore;
        }

        $collected = $answers->withCommands();

        if ($collected === [] || ! $this->actors->hasActor()) {
            return;
        }

        $this->facts->publishAfterCommit(
            new LifecycleAnswersSettled($collected, $this->actors->actor(), $this->actors->authority()),
        );
    }

    /**
     * Refuses a change to a stack while its own lifecycle methods run.
     *
     * @throws StackChangedInLifecycle
     */
    public function assertNotInCallbacks(StackTarget $target): void
    {
        if (isset($this->running[self::keyOf($target)])) {
            throw StackChangedInLifecycle::for($target->description());
        }
    }

    private static function keyOf(StackTarget $target): string
    {
        return $target->agentId.'/'.$target->sessionId;
    }
}
