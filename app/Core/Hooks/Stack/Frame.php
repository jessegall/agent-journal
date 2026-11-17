<?php

declare(strict_types=1);

namespace App\Core\Hooks\Stack;

use App\Core\Hooks\Contracts\HookInput;
use App\Core\Hooks\Decisions\Decision;
use App\Core\Hooks\Decisions\StateReference;
use App\Core\Hooks\States\AgentState;
use App\Core\Hooks\Storage\FrameRecord;

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
     * The state's answer to a hook: its before() when that decides, otherwise the hook's own method.
     */
    public function answer(HookInput $input): Decision
    {
        return $this->state->before($input) ?? $input->answerBy($this->state);
    }
}
