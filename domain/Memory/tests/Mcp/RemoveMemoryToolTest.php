<?php

declare(strict_types=1);

namespace Domain\Memory\Tests\Mcp;

use Domain\Memory\Commands\RemoveMemory\RemoveMemoryCommand;
use Domain\Memory\Mcp\Tools\RemoveMemoryTool;
use Domain\Memory\MemoryDomain;
use Domain\Memory\Tests\Fixtures\MemoryFixtures;
use Tests\Support\Bus\ExpectedCommand;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent removes one of its memories.
 */
#[TestsMcpTool(RemoveMemoryTool::class)]
final class RemoveMemoryToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(MemoryDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Builder');
        $memory = $journal->fixtures(MemoryFixtures::class)->memory('Rule', 'Builder', 'Run the phase tests once.')->memoryCalled('Rule');

        return ToolCall::by($start)
            ->arguments(['memory_id' => $memory->id, 'request_key' => 'write-1'])
            ->expects(ExpectedCommand::of(RemoveMemoryCommand::class, ['memoryId' => $memory->id]));
    }
}
