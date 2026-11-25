<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Counting;

use App\Support\States\AgentState;

/**
 * A state for tests that keeps a count of its own, as a plan review keeps its count of reviewers still out.
 */
final class CountState extends AgentState
{
    private CountedValues $values;

    public function __construct()
    {
        $this->values = new CountedValues();
    }

    public function count(): void
    {
        $this->values = new CountedValues($this->values->count + 1);
    }

    public function counted(): int
    {
        return $this->values->count;
    }
}
