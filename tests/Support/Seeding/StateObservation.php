<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Hooks\Enums\AnswerType;
use App\Stacks\AgentStack;
use App\Stacks\Frames\Frame;
use App\Stacks\HookAnswer;
use App\Stacks\References\StateReference;
use App\Stacks\StateLoading\StateValues;
use App\Support\Storage\WalkStep;
use PHPUnit\Framework\Assert;
use Tests\Support\Seeding\Exceptions\FixtureRefused;
use Tests\Support\TestText;

/**
 * A bound state's frame and its stack after one given step, against the stack before it, with the answer the stack
 * gave when that step ended on a hook.
 */
final readonly class StateObservation
{
    public function __construct(
        private StateReference $reference,
        private string $frameId,
        private AgentStack $before,
        private AgentStack $after,
        private HookAnswer|null $answer,
        private string $lastStep,
    ) {}

    /**
     * The bound frame is on the stack, its work not done and its state switched on.
     */
    public function assertLive(): void
    {
        Assert::assertTrue($this->frame()->isLive(), "The state {$this->reference->typeKey} is not live.");
    }

    public function assertOnTop(): void
    {
        Assert::assertSame(
            $this->frameId,
            $this->after->top()->id,
            "The state {$this->reference->typeKey} is not on top.",
        );
    }

    /**
     * The bound frame is live under another live frame, which a hook asks first.
     */
    public function assertCovered(): void
    {
        $this->assertLive();
        Assert::assertNotSame(
            $this->frameId,
            $this->after->top()->id,
            "The state {$this->reference->typeKey} is on top.",
        );
    }

    /**
     * The bound frame came back on top under the same id, after the step removed the frame that covered it.
     */
    public function assertResumed(): void
    {
        $this->assertOnTop();
        Assert::assertNotSame(
            $this->frameId,
            $this->before->top()->id,
            "The state {$this->reference->typeKey} was on top already.",
        );
    }

    /**
     * The bound frame finished its work and the stack still keeps it.
     */
    public function assertFinished(): void
    {
        Assert::assertTrue($this->frame()->isFinished(), "The state {$this->reference->typeKey} has not finished.");
    }

    /**
     * The bound frame is gone from the stack.
     */
    public function assertPopped(): void
    {
        Assert::assertNotContains(
            $this->frameId,
            $this->after->frameIds(),
            "The state {$this->reference->typeKey} is still on the stack.",
        );
    }

    /**
     * This step put a new frame of the reference on the stack; a frame of it that was there before does not count.
     */
    public function assertPushed(StateReference $reference): void
    {
        $new = array_filter(
            $this->after->framesMissingFrom($this->before),
            fn (Frame $frame) => $frame->isFor($reference),
        );

        Assert::assertNotSame([], $new, "The step pushed no {$reference->typeKey} frame.");
    }

    /**
     * A frame of the reference is on the stack, whenever it came.
     */
    public function assertPresent(StateReference $reference): void
    {
        $present = array_filter($this->after->frames(), fn (Frame $frame) => $frame->isFor($reference));

        Assert::assertNotSame([], $present, "No {$reference->typeKey} frame is on the stack.");
    }

    /**
     * @param  list<string>  $typeKeys  bottom first
     */
    public function assertStack(array $typeKeys): void
    {
        Assert::assertSame($typeKeys, array_map(fn (Frame $frame) => $frame->typeKey(), $this->after->frames()));
    }

    /**
     * @param  list<StateReference>  $references  bottom first
     */
    public function assertStackReferences(array $references): void
    {
        Assert::assertEquals($references, array_map(fn (Frame $frame) => $frame->reference, $this->after->frames()));
    }

    /**
     * The bound state saves exactly this value at the dotted path; a missing value is not a null one.
     */
    public function assertValue(string $path, mixed $expected): void
    {
        $value = StateValues::of($this->frame()->state);

        foreach (explode('.', $path) as $key) {
            Assert::assertIsArray($value, "The state {$this->reference->typeKey} saves no value at {$path}.");
            Assert::assertArrayHasKey($key, $value, "The state {$this->reference->typeKey} saves no value at {$path}.");
            $value = $value[$key];
        }

        Assert::assertSame($expected, $value, "The state {$this->reference->typeKey} saves another value at {$path}.");
    }

    /**
     * What the stack as a whole answered the last hook.
     */
    public function assertAnswer(AnswerType $expected): void
    {
        Assert::assertSame($expected, $this->hookAnswer()->decision->answerType());
    }

    /**
     * The stack refused the last hook with a reason that holds these words.
     */
    public function assertRefusedWith(string $words): void
    {
        Assert::assertStringContainsString($words, TestText::words($this->hookAnswer()->decision->refusalReason()));
    }

    /**
     * What the bound frame itself answered the last hook, before any frame under it had a say.
     */
    public function assertStateAnswer(AnswerType $expected): void
    {
        $own = $this->ownSteps();

        Assert::assertNotSame([], $own, "The state {$this->reference->typeKey} was not asked the last hook.");
        Assert::assertSame($expected, $own[0]->answer);
    }

    public function assertStateWasNotAsked(): void
    {
        Assert::assertSame([], $this->ownSteps(), "The state {$this->reference->typeKey} was asked the last hook.");
    }

    /**
     * @return list<WalkStep>
     */
    private function ownSteps(): array
    {
        return array_values(
            array_filter($this->hookAnswer()->steps, fn (WalkStep $step) => $step->frameId === $this->frameId),
        );
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

        Assert::fail("The state {$this->reference->typeKey} is not on the stack.");
    }
}
