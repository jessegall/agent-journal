<?php

declare(strict_types=1);

namespace Tests\Support\Assertions\Facts;

use App\Stacks\AgentStack;
use App\Stacks\StateLoading\StateValues;
use Tests\Support\Assertions\Contracts\Facts;

/**
 * The values a state on a stack saves with its frame, as the stack holds them after a step; none once it is gone.
 */
final readonly class StateFacts implements Facts
{
    public function __construct(private AgentStack $stack, private string $frameId) {}

    public function facts(): array
    {
        foreach ($this->stack->frames() as $frame) {
            if ($frame->id === $this->frameId) {
                return StateValues::of($frame->state);
            }
        }

        return [];
    }
}
