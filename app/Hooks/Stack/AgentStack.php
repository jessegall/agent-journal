<?php

declare(strict_types=1);

namespace App\Hooks\Stack;

use App\Hooks\Contracts\HookInput;
use App\Hooks\Contracts\StateFactory;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Declarations\StateMethods;
use App\Hooks\Exceptions\BottomStateCannotFinish;
use App\Hooks\Exceptions\MissingBottomState;
use App\Hooks\Storage\FrameRecords;

/**
 * The immutable frame order of an agent's stack, with hook decisions collected from its live snapshot.
 */
final readonly class AgentStack
{
    /**
     * The most frames one stack may hold, ready included.
     */
    public const int DEEPEST = 100;

    /**
     * @param  list<Frame>  $frames  bottom first
     */
    public function __construct(
        private array $frames,
        private StateFactory $factory,
        private StateMethodSelector $selector = new StateMethodSelector(new StateMethods()),
    ) {}

    public function answer(HookInput $input): HookAnswer
    {
        $bottom = $this->frames[0] ?? null;

        if ($bottom === null || ! $bottom->isBottom() || ! $bottom->isLive()) {
            throw MissingBottomState::for($input->methodName());
        }

        $selected = $this->selector->forHook($this, $input);

        if ($selected === []) {
            throw MissingBottomState::for($input->methodName());
        }

        $walk = new HookWalk($this, $this->top());

        foreach ($selected as $handler) {
            $walk->collect($handler, $input);
        }

        return $walk->finish();
    }

    public function permission(): StackVerdict
    {
        foreach (array_reverse($this->frames) as $frame) {
            if (! $frame->isLive()) {
                continue;
            }

            $permission = $frame->state->workPermission();

            if (! $permission->allowed) {
                return $permission;
            }
        }

        return StackVerdict::allow();
    }

    /**
     * The stack with a state put on top, or this stack when it already holds a state for the same reference or the
     * state is a conditional state that is switched off. Every push passes through here, so a declined push stores
     * nothing.
     */
    public function withStateOnTop(StateReference $reference): self
    {
        foreach ($this->frames as $frame) {
            if ($frame->isFor($reference)) {
                return $this;
            }
        }

        if (! $this->factory->isEnabled($reference)) {
            return $this;
        }

        $frame = $this->factory->frameFor($reference);

        if (! $frame->isEnabled()) {
            return $this;
        }

        return clone ($this, ['frames' => [...$this->frames, $frame]]);
    }

    /**
     * The stack without a frame whose work is done; a frame that is already gone changes nothing.
     */
    public function withoutFrame(Frame $frame): self
    {
        if ($frame->isBottom()) {
            throw BottomStateCannotFinish::for($frame->typeKey());
        }

        $kept = array_filter($this->frames, fn (Frame $candidate) => $candidate->id !== $frame->id);

        return clone ($this, ['frames' => array_values($kept)]);
    }

    /**
     * The stack without the finished or switched-off frames exposed at its physical top, down to the first live one.
     * A frame that is not live under a live one is only passed over by a walk, never removed: skipping is not popping.
     */
    public function withoutExposedInactive(): self
    {
        $frames = $this->frames;

        foreach (array_reverse($this->frames) as $frame) {
            if ($frame->isBottom() || $frame->isLive()) {
                break;
            }

            array_pop($frames);
        }

        return clone ($this, ['frames' => $frames]);
    }

    /**
     * The stack after a frame's explicit pop: without the frame, then without the inactive frames that pop exposed.
     */
    public function poppedOf(Frame $frame): self
    {
        return $this->withoutFrame($frame)->withoutExposedInactive();
    }

    /**
     * @return list<Frame> bottom first
     */
    public function frames(): array
    {
        return $this->frames;
    }

    /**
     * The frames of this stack, ready excepted, that the other stack does not hold, bottom first.
     *
     * @return list<Frame>
     */
    public function framesMissingFrom(self $other): array
    {
        $held = array_flip($other->frameIds());

        return array_values(
            array_filter($this->frames, fn (Frame $frame) => ! $frame->isBottom() && ! isset($held[$frame->id])),
        );
    }

    /**
     * The live top of this stack when a live frame covered it in the earlier stack and this change removed that frame,
     * so it comes back on top; none for ready, a new frame, a top that did not change, or a top only finished or
     * switched-off frames covered, since it already answered first.
     */
    public function topResumedSince(self $earlier): Frame|null
    {
        $top = $this->top();
        $earlierTop = $earlier->top();
        $coverRemoved = ! in_array($earlierTop->id, $this->frameIds(), true);
        $wasHeld = in_array($top->id, $earlier->frameIds(), true);

        if ($top->isBottom() || ! $wasHeld || $earlierTop->id === $top->id || ! $coverRemoved) {
            return null;
        }

        return $top;
    }

    /**
     * The highest live frame: the one a hook asks first and the only one that may push. Finished and switched-off
     * frames above it stay stored but are passed over.
     *
     * @throws MissingBottomState when the stack holds no live frame at all
     */
    public function top(): Frame
    {
        foreach (array_reverse($this->frames) as $frame) {
            if ($frame->isLive()) {
                return $frame;
            }
        }

        throw MissingBottomState::for('top');
    }

    /**
     * @return list<string>
     */
    public function frameIds(): array
    {
        return array_map(fn (Frame $frame) => $frame->id, $this->frames);
    }

    public function records(): FrameRecords
    {
        return new FrameRecords(array_map(fn (Frame $frame) => $frame->record(), $this->frames));
    }
}
