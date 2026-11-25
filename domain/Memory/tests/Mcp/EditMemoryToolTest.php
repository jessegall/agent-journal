<?php

declare(strict_types=1);

namespace Domain\Memory\Tests\Mcp;

use Domain\Memory\Mcp\Tools\EditMemoryTool;
use Domain\Memory\MemoryDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool EditMemoryTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(EditMemoryTool::class)]
final class EditMemoryToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(MemoryDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        throw EntryTestNeedsArrangement::for('EditMemoryTool', [
            'the argument memory_id',
            'the argument expected_revision',
            'the argument request_key',
            'the expected commands',
            'the sink replies',
        ]);
    }
}
