<?php

declare(strict_types=1);

namespace App\Hooks\Stack\Frames;

use App\Agents\Values\StackTarget;
use App\Contracts\Event;
use App\Hooks\Contracts\ConditionalState;
use App\Hooks\Decisions\Decision;
use App\Hooks\Inputs\Contracts\HookInput;
use App\Hooks\Lifecycle\LifecycleContext;
use App\Hooks\References\StateReference;
use App\Hooks\States\AgentState;
use App\Hooks\Storage\FrameRecord;
use App\Hooks\Values\EventCommands;
use App\Hooks\Values\LifecycleCommands;
use Carbon\CarbonImmutable;

/**
 * One state on a stack, with the frame id it is stored under, the reference it was built from and the time it entered
 * the stack, which never changes while the frame lives.
 */
final readonly class Frame
{
    public function __construct(
        public string $id,
        public StateReference $reference,
        public AgentState $state,
        public CarbonImmutable $enteredAt,
        private bool $bottom = false,
        public int $schemaVersion = 1,
        private bool $typeEnabled = true,
    ) {}

    /**
     * The frame of a stored record, with whether its state type runs now as the restore found it.
     */
    public static function restored(FrameRecord $record, AgentState $state, bool $typeEnabled = true): self
    {
        return new self(
            $record->id,
            $record->reference,
            $state,
            $record->enteredAt,
            $record->isBottom,
            $record->schemaVersion,
            $typeEnabled,
        );
    }

    public function record(): FrameRecord
    {
        return new FrameRecord($this->id, $this->reference, $this->bottom, $this->schemaVersion, $this->enteredAt);
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
     * Whether the state may run now: not while its state type is switched off, and otherwise always, unless it is a
     * conditional state that answers it is switched off.
     */
    public function isEnabled(): bool
    {
        return $this->typeEnabled && (! $this->state instanceof ConditionalState || $this->state->isEnabled());
    }

    /**
     * Whether a hook asks this frame: its work is not done and it may run now. A frame that is not live stays stored.
     */
    public function isLive(): bool
    {
        return ! $this->isFinished() && $this->isEnabled();
    }

    public function enter(StackTarget $target): LifecycleCommands
    {
        return $this->state->onEnter($this->lifecycleContext($target));
    }

    public function resume(StackTarget $target): LifecycleCommands
    {
        return $this->state->onResume($this->lifecycleContext($target));
    }

    public function exit(StackTarget $target): LifecycleCommands
    {
        return $this->state->onExit($this->lifecycleContext($target));
    }

    /**
     * The state's answer to a hook: its before() when that decides, otherwise the hook's own method.
     */
    public function answer(HookInput $input): Decision
    {
        return $this->state->before($input) ?? $input->answerBy($this->state);
    }

    public function answerEvent(Event $event, string $method): EventCommands
    {
        return $this->state->{$method}($event);
    }

    private function lifecycleContext(StackTarget $target): LifecycleContext
    {
        return new LifecycleContext($target, $this->id, $this->reference);
    }
}
