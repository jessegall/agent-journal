<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\Mcp\Tools\AssigneesListTool;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool AssigneesListTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(AssigneesListTool::class)]
final class AssigneesListToolTest extends McpToolEntryTestCase
{
    protected function arrange(TestJournal $journal): ToolCall
    {
        throw EntryTestNeedsArrangement::for('AssigneesListTool', [
            'the argument type',
        ]);
    }
}
