<?php

declare(strict_types=1);

namespace App\Core\Hooks\Stack;

use App\Core\Hooks\Contracts\HookInput;
use App\Core\Hooks\Contracts\StateFactory;
use App\Core\Hooks\Decisions\AnswerKind;
use App\Core\Hooks\Decisions\Decision;
use App\Core\Hooks\Decisions\StateReference;
use App\Core\Hooks\Exceptions\BottomStateCannotFinish;
use App\Core\Hooks\Exceptions\BottomStateDelegated;
use App\Core\Hooks\Exceptions\InvalidHookAnswer;
use App\Core\Hooks\Exceptions\MissingBottomState;
use App\Core\Hooks\Exceptions\NonBottomStateAllowed;
use App\Core\Hooks\Storage\FrameRecord;
use App\Core\Hooks\Storage\FrameRecords;

/**
 * The states of one agent, bottom first. A hook walks them from the top until one gives a real answer;
 * the answer carries the stack as the walk left it, and this stack never changes.
 */
final readonly class AgentStack
{
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
            $decision = $input->answerBy($frame->state);
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
     * The stack with a state put on top, or this stack when it already holds a state for the same reference.
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

        if (! $frame->isBottom() && $decision->answerKind() === AnswerKind::Allow) {
            throw NonBottomStateAllowed::for($frame->typeKey(), $input->methodName());
        }

        if (! $input->accepts($decision->answerKind())) {
            throw InvalidHookAnswer::for($input->methodName(), $decision->answerKind()->value);
        }
    }
}
