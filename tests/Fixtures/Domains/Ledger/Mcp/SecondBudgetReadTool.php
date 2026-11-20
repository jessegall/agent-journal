<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Ledger\Mcp;

use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalReadTool;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[Name('budget_read')]
#[IsReadOnly]
final class SecondBudgetReadTool extends JournalReadTool
{
    protected function read(ToolArguments $arguments): ToolResult
    {
        return ToolResult::ok([], []);
    }
}
