<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\Mcp\Tools\SearchTool;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent searches the journal's records and passages by words.
 */
#[TestsMcpTool(SearchTool::class)]
final class SearchToolTest extends McpToolEntryTestCase
{
    protected function arrange(TestJournal $journal): ToolCall
    {
        return ToolCall::by($journal->owner()->signedStart('Agent'))->arguments(['query' => 'release notes']);
    }
}
