<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Stack;

use App\Domain\Hooks\Decisions\StateReference;
use App\Domain\Hooks\States\AgentState;

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
    ) {}

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
}
