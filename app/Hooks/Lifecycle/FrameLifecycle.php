<?php

declare(strict_types=1);

namespace App\Hooks\Lifecycle;

use App\Agents\Support\StackTarget;
use App\Hooks\Events\Support\StateEventActivity;
use App\Hooks\Exceptions\StackChangedInLifecycle;
use App\Hooks\Exceptions\StackTooDeep;
use App\Hooks\Stack\AgentStack;
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

    public function __construct(private readonly StateEventActivity $eventActivity) {}

    /**
     * @throws StackTooDeep when the stack after the change holds more frames than a stack may
     */
    public function settle(StackTarget $target, AgentStack $before, AgentStack $after): void
    {
        if (count($after->frames()) > AgentStack::DEEPEST) {
            throw StackTooDeep::for($target->description(), AgentStack::DEEPEST);
        }

        $removed = $before->framesMissingFrom($after);
        $added = $after->framesMissingFrom($before);
        $resumed = $after->topResumedSince($before);
        $runningBefore = $this->running;
        $this->running[self::keyOf($target)] = true;

        try {
            $this->eventActivity->evaluate($target, function () use ($target, $removed, $added, $resumed): void {
                foreach (array_reverse($removed) as $frame) {
                    $frame->exit($target);
                }

                foreach ($added as $frame) {
                    $frame->enter($target);
                }

                $resumed?->resume($target);
            });
        } finally {
            $this->running = $runningBefore;
        }
    }

    /**
     * Refuses a change to a stack while its own lifecycle methods run.
     *
     * @throws StackChangedInLifecycle
     */
    public function refuseChangeDuringCallbacks(StackTarget $target): void
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
