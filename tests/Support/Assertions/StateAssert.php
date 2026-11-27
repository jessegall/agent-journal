<?php

declare(strict_types=1);

namespace Tests\Support\Assertions;

use App\Hooks\Enums\AnswerType;
use App\Stacks\AgentStack;
use App\Stacks\Frames\Frame;
use App\Stacks\HookAnswer;
use App\Stacks\References\StateReference;
use App\Support\Storage\WalkStep;
use PHPUnit\Framework\Assert as PHPUnit;
use Tests\Support\Assertions\Facts\StateFacts;
use Tests\Support\Seeding\Exceptions\FixtureRefused;
use Tests\Support\TestText;

/**
 * A state's frame and its stack after one step, against the stack before it: the state's own values are its facts,
 * and the frame, the stack and the answer the last hook got are asserted beside them. Like the journal's root, it
 * passes a value nobody touched.
 */
final class StateAssert extends Assert
{
    public function __construct(
        private readonly StateReference $reference,
        private readonly string $frameId,
        private readonly AgentStack $before,
        private readonly AgentStack $after,
        private readonly HookAnswer|null $answer,
        private readonly string $lastStep,
    ) {
        parent::__construct(new StateFacts($after, $frameId), $reference->typeKey, false);
    }

    /**
     * The frame is on the stack, its work not done and its state switched on.
     */
    public function isLive(): static
    {
        PHPUnit::assertTrue($this->frame()->isLive(), "The state {$this->reference->typeKey} is not live.");

        return $this;
    }

    public function isOnTop(): static
    {
        PHPUnit::assertSame(
            $this->frameId,
            $this->after->top()->id,
            "The state {$this->reference->typeKey} is not on top.",
        );

        return $this;
    }

    /**
     * The frame is live under another live frame, which a hook asks first.
     */
    public function isCovered(): static
    {
        $this->isLive();
        PHPUnit::assertNotSame(
            $this->frameId,
            $this->after->top()->id,
            "The state {$this->reference->typeKey} is on top.",
        );

        return $this;
    }

    /**
     * The frame came back on top under the same id, after the step removed the frame that covered it.
     */
    public function isResumed(): static
    {
        $this->isOnTop();
        PHPUnit::assertNotSame(
            $this->frameId,
            $this->before->top()->id,
            "The state {$this->reference->typeKey} was on top already.",
        );

        return $this;
    }

    /**
     * The frame finished its work and the stack still keeps it.
     */
    public function isFinished(): static
    {
        PHPUnit::assertTrue($this->frame()->isFinished(), "The state {$this->reference->typeKey} has not finished.");

        return $this;
    }

    /**
     * The frame is gone from the stack.
     */
    public function isPopped(): static
    {
        PHPUnit::assertNotContains(
            $this->frameId,
            $this->after->frameIds(),
            "The state {$this->reference->typeKey} is still on the stack.",
        );

        return $this;
    }

    /**
     * The step put a new frame of the reference on the stack; a frame of it that was there before does not count.
     */
    public function pushed(StateReference $reference): static
    {
        $new = array_filter(
            $this->after->framesMissingFrom($this->before),
            fn (Frame $frame) => $frame->isFor($reference),
        );

        PHPUnit::assertNotSame([], $new, "The step pushed no {$reference->typeKey} frame.");

        return $this;
    }

    /**
     * A frame of the reference is on the stack, whenever it came.
     */
    public function present(StateReference $reference): static
    {
        $present = array_filter($this->after->frames(), fn (Frame $frame) => $frame->isFor($reference));

        PHPUnit::assertNotSame([], $present, "No {$reference->typeKey} frame is on the stack.");

        return $this;
    }

    /**
     * @param  list<string>  $typeKeys  bottom first
     */
    public function stackIs(array $typeKeys): static
    {
        PHPUnit::assertSame($typeKeys, array_map(fn (Frame $frame) => $frame->typeKey(), $this->after->frames()));

        return $this;
    }

    /**
     * What the state itself answered the last hook, before any frame under it had a say.
     */
    public function answers(AnswerType $expected): static
    {
        $own = array_values(
            array_filter($this->hookAnswer()->steps, fn (WalkStep $step) => $step->frameId === $this->frameId),
        );

        PHPUnit::assertNotSame([], $own, "The state {$this->reference->typeKey} was not asked the last hook.");
        PHPUnit::assertSame($expected, $own[0]->answer);

        return $this;
    }

    /**
     * What the stack as a whole answered the last hook.
     */
    public function stackAnswers(AnswerType $expected): static
    {
        PHPUnit::assertSame($expected, $this->hookAnswer()->decision->answerType());

        return $this;
    }

    /**
     * The stack refused the last hook with a reason that holds these words.
     */
    public function refuses(string $words): static
    {
        PHPUnit::assertStringContainsString(
            $words,
            TestText::words($this->hookAnswer()->decision->refusalReason()),
        );

        return $this;
    }

    private function hookAnswer(): HookAnswer
    {
        return $this->answer ?? throw FixtureRefused::noHookAnswer($this->lastStep);
    }

    private function frame(): Frame
    {
        foreach ($this->after->frames() as $frame) {
            if ($frame->id === $this->frameId) {
                return $frame;
            }
        }

        PHPUnit::fail("The state {$this->reference->typeKey} is not on the stack.");
    }
}
