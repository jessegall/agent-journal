<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Mcp;

use Domain\Chat\ChatDomain;
use Domain\Chat\Mcp\Tools\DockRemoveTool;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool DockRemoveTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(DockRemoveTool::class)]
final class DockRemoveToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        throw EntryTestNeedsArrangement::for('DockRemoveTool', [
            'the argument placement_id',
            'the argument type',
            'the argument source_id',
            'the argument request_key',
            'the expected commands',
            'the sink replies',
        ]);
    }
}
