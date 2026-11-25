<?php

declare(strict_types=1);

namespace Domain\Memory\Tests\Mcp;

use Domain\Memory\Mcp\Tools\MemoryReadTool;
use Domain\Memory\MemoryDomain;
use Domain\Memory\Tests\Fixtures\MemoryFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent reads one of its memories whole.
 */
#[TestsMcpTool(MemoryReadTool::class)]
final class MemoryReadToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(MemoryDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Builder');
        $memory = $journal->fixtures(MemoryFixtures::class)->memory('Rule', 'Builder', 'Run the phase tests once.')->memoryCalled('Rule');

        return ToolCall::by($start)->arguments(['memory_id' => $memory->id]);
    }
}
