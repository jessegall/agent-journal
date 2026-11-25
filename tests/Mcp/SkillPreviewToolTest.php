<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\Mcp\Tools\SkillPreviewTool;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool SkillPreviewTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(SkillPreviewTool::class)]
final class SkillPreviewToolTest extends McpToolEntryTestCase
{
    protected function arrange(TestJournal $journal): ToolCall
    {
        throw EntryTestNeedsArrangement::for('SkillPreviewTool', [
            'the argument key',
        ]);
    }
}
