<?php

declare(strict_types=1);

namespace Tests\Fixtures\StatePublicMethods;

use App\Stacks\AgentState;

/**
 * A state that hands out its data, through a public getter and a static method, which the state test refuses.
 */
final class DataLeakingState extends AgentState
{
    private int $count = 0;

    public static function counting(): self
    {
        return new self();
    }

    public function count(): int
    {
        return $this->count;
    }
}
