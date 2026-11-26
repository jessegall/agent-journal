<?php

declare(strict_types=1);

namespace Tests\Fixtures\Mcp\Leaky;

use App\CommandRules\Mcp\Tools\JournalReadTool;
use App\Mcp\Data\ToolResult;
use App\Mcp\Models\RetainedPage;
use App\Mcp\Support\ToolArguments;
use Laravel\Mcp\Server\Attributes\Name;

/**
 * A read tool that queries a model itself, so the Mcp rules can be shown naming it.
 */
#[Name('leaky_read')]
final class LeakyReadTool extends JournalReadTool
{
    protected function read(ToolArguments $arguments): ToolResult
    {
        return ToolResult::ok(['pages' => RetainedPage::query()->count()], []);
    }
}
