<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\Mcp\Tools\CapabilitiesReadTool;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool CapabilitiesReadTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(CapabilitiesReadTool::class)]
final class CapabilitiesReadToolTest extends McpToolEntryTestCase
{
    protected function arrange(TestJournal $journal): ToolCall
    {
        return ToolCall::by($journal->owner()->signedStart('Agent'));
    }
}
