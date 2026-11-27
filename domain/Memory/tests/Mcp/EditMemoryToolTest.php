<?php

declare(strict_types=1);

namespace Domain\Memory\Tests\Mcp;

use Domain\Memory\Commands\EditMemory\EditMemoryCommand;
use Domain\Memory\Mcp\Tools\EditMemoryTool;
use Domain\Memory\MemoryDomain;
use Domain\Memory\Tests\Fixtures\MemoryFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent edits one of its memories at the revision it read.
 */
#[TestsMcpTool(EditMemoryTool::class)]
final class EditMemoryToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(MemoryDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Builder');

        $memory = $journal->fixtures(MemoryFixtures::class)->createMemory(
            'Rule',
            'Builder',
            'Run the phase tests once.',
        );

        return ToolCall::by($start)
            ->arguments([
                'memory_id' => $memory->id,
                'expected_revision' => 1,
                'weight' => 9,
                'request_key' => 'write-1',
            ])
            ->reply(EditMemoryCommand::class, $memory->id)
            ->expects(EditMemoryCommand::class, ['memoryId' => $memory->id, 'expectedRevision' => 1, 'weight' => 9]);
    }
}
