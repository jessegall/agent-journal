<?php

declare(strict_types=1);

namespace App\Hooks\Stack;

use App\Agents\Support\StackTarget;
use App\Hooks\Contracts\ConditionalState;
use App\Hooks\Contracts\HookInput;
use App\Hooks\Decisions\Decision;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Lifecycle\LifecycleContext;
use App\Hooks\States\AgentState;
use App\Hooks\Storage\FrameRecord;

/**
 * One state on a stack, with the frame id it is stored under and the reference it was built from.
 */
final readonly class Frame
{
    public function __construct(
        public string $id,
        public StateReference $reference,
        public AgentState $state,
        private bool $bottom = false,
        public int $schemaVersion = 1,
    ) {}

    public static function restored(FrameRecord $record, AgentState $state): self
    {
        return new self($record->id, $record->reference, $state, $record->isBottom, $record->schemaVersion);
    }

    public function isBottom(): bool
    {
        return $this->bottom;
    }

    public function typeKey(): string
    {
        return $this->reference->typeKey;
    }

    public function isFor(StateReference $reference): bool
    {
        return $this->reference->isSameAs($reference);
    }

    public function isFinished(): bool
    {
        return $this->state->isFinished();
    }

    /**
     * Whether the state may run now: always, unless it is a conditional state that answers it is switched off.
     */
    public function isEnabled(): bool
    {
        return ! $this->state instanceof ConditionalState || $this->state->isEnabled();
    }

    public function enter(StackTarget $target): void
    {
        $this->state->onEnter($this->lifecycleContext($target));
    }

    public function resume(StackTarget $target): void
    {
        $this->state->onResume($this->lifecycleContext($target));
    }

    public function exit(StackTarget $target): void
    {
        $this->state->onExit($this->lifecycleContext($target));
    }

    /**
     * The state's answer to a hook: its before() when that decides, otherwise the hook's own method.
     */
    public function answer(HookInput $input): Decision
    {
        return $this->state->before($input) ?? $input->answerBy($this->state);
    }

    private function lifecycleContext(StackTarget $target): LifecycleContext
    {
        return new LifecycleContext($target, $this->id, $this->reference);
    }
}
