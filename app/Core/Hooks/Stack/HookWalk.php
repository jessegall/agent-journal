<?php

declare(strict_types=1);

namespace App\Core\Hooks\Stack;

use App\Core\Hooks\Decisions\Decision;
use App\Core\Hooks\Decisions\StateReference;
use App\Core\Hooks\Exceptions\StateBelowTopPushed;
use App\Core\Hooks\Storage\WalkStep;

/**
 * Collects the context, the steps and the stack changes of one walk while it runs, and builds its answer at the end.
 */
final class HookWalk
{
    /**
     * @var list<string>
     */
    private array $context = [];

    /**
     * @var list<WalkStep>
     */
    private array $steps = [];

    private AgentStack $stack;

    /**
     * @param  Frame  $walkTop  the frame on top when the walk began, the only one that may push
     */
    public function __construct(
        private readonly string $hookMethod,
        AgentStack $stack,
        private readonly Frame $walkTop,
    ) {
        $this->stack = $stack;
    }

    public function record(Frame $frame, Decision $decision): void
    {
        $this->context = [...$this->context, ...$decision->context];
        $this->steps[] = new WalkStep(
            $frame->id,
            $frame->typeKey(),
            $this->hookMethod,
            $decision->answerKind(),
            $decision->transition->kind(),
        );
    }

    public function removeFrame(Frame $frame): void
    {
        $this->stack = $this->stack->withoutFrame($frame);
    }

    public function pushOver(Frame $frame, StateReference $state): void
    {
        if ($frame->id !== $this->walkTop->id) {
            throw StateBelowTopPushed::for($frame->typeKey());
        }

        $this->stack = $this->stack->withStateOnTop($state);
    }

    public function finish(Decision $decision): HookAnswer
    {
        return new HookAnswer($decision, $this->context, $this->steps, $this->stack);
    }

    /**
     * The frames this walk asked, top first.
     *
     * @return list<string>
     */
    public function visitedFrames(): array
    {
        return array_map(fn (WalkStep $step) => $step->frameId, $this->steps);
    }
}
