<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\Mcp\Tools\OperationsReadTool;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent asks what became of a write it sent under a request key; a key that never ran reads as unknown.
 */
#[TestsMcpTool(OperationsReadTool::class)]
final class OperationsReadToolTest extends McpToolEntryTestCase
{
    protected function arrange(TestJournal $journal): ToolCall
    {
        return ToolCall::by($journal->owner()->signedStart('Planner'))
            ->arguments(['request_key' => 'never-sent-1']);
    }
}
