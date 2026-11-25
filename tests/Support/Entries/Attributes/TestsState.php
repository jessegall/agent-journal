<?php

declare(strict_types=1);

namespace Tests\Support\Entries\Attributes;

use App\Support\States\AgentState;
use Attribute;

/**
 * The agent state a test class is the one test of.
 */
#[Attribute(Attribute::TARGET_CLASS)]
final readonly class TestsState
{
    /**
     * @param  class-string<AgentState>  $state
     */
    public function __construct(public string $state) {}
}
