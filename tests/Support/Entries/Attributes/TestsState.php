<?php

declare(strict_types=1);

namespace Tests\Support\Entries\Attributes;

use App\Support\States\AgentState;
use Attribute;
use Tests\Support\Entries\Contracts\NamesEntry;

/**
 * The agent state a test class is the one test of.
 */
#[Attribute(Attribute::TARGET_CLASS)]
final readonly class TestsState implements NamesEntry
{
    /**
     * @param  class-string<AgentState>  $state
     */
    public function __construct(public string $state) {}

    public function entryName(): string
    {
        return $this->state;
    }
}
