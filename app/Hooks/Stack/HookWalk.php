<?php

declare(strict_types=1);

namespace App\Hooks\Stack;

use App\Hooks\Contracts\HookInput;
use App\Hooks\Decisions\Decision;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Enums\AnswerType;
use App\Hooks\Exceptions\BottomStateDelegated;
use App\Hooks\Exceptions\InvalidHookAnswer;
use App\Hooks\Exceptions\StateBelowTopPushed;
use App\Hooks\Storage\WalkStep;
use Closure;

/**
 * Folds the selected decisions and stages their stack changes in call order.
 */
final class HookWalk
{
    /**
     * @var list<string>
     */
    private array $context = [];

    /**
     * @var list<string>
     */
    private array $messages = [];

    /**
     * @var list<WalkStep>
     */
    private array $steps = [];

    /**
     * @var list<Closure(): void>
     */
    private array $transitions = [];

    private Decision $retained;

    public function __construct(private AgentStack $stack, private readonly Frame $walkTop)
    {
        $this->retained = Decision::delegate();
    }

    public function collect(SelectedStateMethod $selected, HookInput $input): void
    {
        $frame = $selected->frame;
        $decision = $frame->answer($input);
        $answer = $decision->answerType();

        $this->steps[] = WalkStep::fromDecision($selected, $decision);

        if ($frame->isBottom() && $decision->isDelegating()) {
            throw BottomStateDelegated::for($frame->typeKey(), $input->methodName(), $this->visitedFrames());
        }

        if (! $input->accepts($answer)) {
            throw InvalidHookAnswer::for($input->methodName(), $answer->value);
        }

        $this->context = [...$this->context, ...$decision->context];
        $this->messages = [...$this->messages, ...$decision->messages];
        $this->transitions[] = fn () => $decision->transition->applyTo(new FrameEditor($this, $frame));

        if ($answer === AnswerType::Deny || $this->retained->answerType() !== AnswerType::Deny) {
            $this->retained = $decision;
        }
    }

    public function removeFrame(Frame $frame): void
    {
        $this->stack = $this->stack->poppedOf($frame);
    }

    public function pushOver(Frame $frame, StateReference $state): void
    {
        if ($frame->id !== $this->walkTop->id) {
            throw StateBelowTopPushed::for($frame->typeKey());
        }

        $this->stack = $this->stack->withoutExposedInactive()->withStateOnTop($state);
    }

    public function finish(): HookAnswer
    {
        foreach ($this->transitions as $apply) {
            $apply();
        }

        $decision = $this->retained->isDelegating() ? Decision::allow() : $this->retained;

        return new HookAnswer($decision, $this->context, $this->steps, $this->stack, $this->messages);
    }

    /**
     * @return list<string>
     */
    private function visitedFrames(): array
    {
        return array_map(fn (WalkStep $step) => $step->frameId, $this->steps);
    }
}
