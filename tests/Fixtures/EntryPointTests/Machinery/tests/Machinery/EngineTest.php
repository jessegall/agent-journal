<?php

declare(strict_types=1);

namespace Tests\Fixtures\EntryPointTests\Machinery\tests\Machinery;

use App\Support\AgentStacks;
use PHPUnit\Framework\TestCase;
use Tests\Support\Entries\Attributes\TestsMachinery;

/**
 * A machinery test naming an engine class: the machinery check passes it.
 */
#[TestsMachinery(AgentStacks::class)]
final class EngineTest extends TestCase
{
    public function test_it_is_judged_by_what_it_names(): void
    {
        $this->assertTrue(true);
    }
}
