<?php

declare(strict_types=1);

namespace App\Support\Stack\Frames;

use App\Contracts\ConditionalState;
use App\Contracts\Event;
use App\Contracts\OwnValuesState;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\References\StateReference;
use App\Support\States\AgentState;
use App\Support\Storage\FrameRecord;
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
        if ($state instanceof OwnValuesState && $record->values !== []) {
            $state->restoreOwnValues($record->values);
        }

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
        return new FrameRecord(
            $this->id,
            $this->reference,
            $this->bottom,
            $this->schemaVersion,
            $this->enteredAt,
            $this->state instanceof OwnValuesState ? $this->state->ownValues()->toArray() : [],
        );
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

    /**
     * What the state's method for the hook returns, which its one caller reads.
     */
    public function answer(HookInput $input): mixed
    {
        return $input->answerBy($this->state);
    }

    /**
     * What the state's listener for the fact returns: nothing, a command or several, which its one caller checks.
     */
    public function answerEvent(Event $event, string $method): mixed
    {
        return $this->state->{$method}($event);
    }
}
