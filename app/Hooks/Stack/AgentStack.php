<?php

declare(strict_types=1);

namespace App\Hooks\Stack;

use App\Hooks\Contracts\HookInput;
use App\Hooks\Contracts\StateFactory;
use App\Hooks\Decisions\Decision;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Enums\AnswerType;
use App\Hooks\Exceptions\BottomStateCannotFinish;
use App\Hooks\Exceptions\BottomStateDelegated;
use App\Hooks\Exceptions\InvalidHookAnswer;
use App\Hooks\Exceptions\MissingBottomState;
use App\Hooks\Exceptions\NonBottomStateAllowed;
use App\Hooks\Storage\FrameRecord;
use App\Hooks\Storage\FrameRecords;

/**
 * The states of one agent, bottom first. A hook walks them from the top until one gives a real answer;
 * the answer carries the stack as the walk left it, and this stack never changes.
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
    ) {}

    public function answer(HookInput $input): HookAnswer
    {
        $walkFrames = array_reverse($this->frames);

        if ($walkFrames === []) {
            throw MissingBottomState::for($input->methodName());
        }

        $walk = new HookWalk($input->methodName(), $this, $walkFrames[0]);

        foreach ($walkFrames as $frame) {
            if ($frame->isFinished()) {
                continue;
            }

            $decision = $frame->answer($input);
            $walk->record($frame, $decision);
            $this->checkDecision($frame, $input, $decision, $walk);
            $decision->transition->applyTo(new FrameEditor($walk, $frame));

            if (! $decision->isDelegating()) {
                return $walk->finish($decision);
            }
        }

        throw MissingBottomState::for($input->methodName());
    }

    /**
     * The stack with a state put on top, or this stack when it already holds a state for the same reference. This is
     * the admission point every push passes through (StatePush, and later the engine's stack): doc 39's conditional
     * states decline a disabled state here.
     */
    public function withStateOnTop(StateReference $reference): self
    {
        foreach ($this->frames as $frame) {
            if ($frame->isFor($reference)) {
                return $this;
            }
        }

        return new self([...$this->frames, $this->factory->frameFor($reference)], $this->factory);
    }

    /**
     * The stack without a frame whose work is done; a frame that is already gone changes nothing.
     */
    public function withoutFrame(Frame $frame): self
    {
        if ($frame->isBottom()) {
            throw BottomStateCannotFinish::for($frame->typeKey());
        }

        return new self(
            array_values(array_filter($this->frames, fn (Frame $candidate) => $candidate->id !== $frame->id)),
            $this->factory,
        );
    }

    /**
     * The stack without every frame whose state reports its work done, wherever it sits.
     */
    public function withoutFinishedFrames(): self
    {
        $stack = $this;

        foreach ($this->frames as $frame) {
            if ($frame->isFinished()) {
                $stack = $stack->withoutFrame($frame);
            }
        }

        return $stack;
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

        return array_values(array_filter($this->frames, fn (Frame $frame) => ! $frame->isBottom() && ! isset($held[$frame->id])));
    }

    /**
     * The top of this stack when the earlier stack held it covered, so it comes back on top; none for ready, a new
     * frame or a top that did not change.
     */
    public function topResumedSince(self $earlier): Frame|null
    {
        $top = $this->top();

        if ($top->isBottom() || ! in_array($top->id, $earlier->frameIds(), true) || $earlier->top()->id === $top->id) {
            return null;
        }

        return $top;
    }

    /**
     * The frame on top: the one a hook asks first.
     *
     * @throws MissingBottomState when the stack holds no frame at all
     */
    public function top(): Frame
    {
        return $this->frames[array_key_last($this->frames) ?? throw MissingBottomState::for('top')];
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
        return new FrameRecords(array_map(
            fn (Frame $frame) => new FrameRecord($frame->id, $frame->reference, $frame->isBottom(), $frame->schemaVersion),
            $this->frames,
        ));
    }

    private function checkDecision(Frame $frame, HookInput $input, Decision $decision, HookWalk $walk): void
    {
        if ($frame->isBottom() && $decision->isDelegating()) {
            throw BottomStateDelegated::for($frame->typeKey(), $input->methodName(), $walk->visitedFrames());
        }

        if (! $frame->isBottom() && $decision->answerType() === AnswerType::Allow) {
            throw NonBottomStateAllowed::for($frame->typeKey(), $input->methodName());
        }

        if (! $input->accepts($decision->answerType())) {
            throw InvalidHookAnswer::for($input->methodName(), $decision->answerType()->value);
        }
    }
}
