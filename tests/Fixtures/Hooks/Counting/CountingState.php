<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Counting;

use App\Hooks\Contracts\KeepsOwnValues;
use App\Hooks\States\AgentState;

/**
 * A state for tests that keeps a count of its own, as a plan review keeps its count of reviewers still out.
 */
final class CountingState extends AgentState implements KeepsOwnValues
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

    public function ownValues(): CountedValues
    {
        return $this->values;
    }

    public function restoreOwnValues(array $stored): void
    {
        $this->values = CountedValues::from($stored);
    }
}
