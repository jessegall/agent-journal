<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Ledger\Mcp;

use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalReadTool;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[IsReadOnly]
#[Name('budget_read')]
#[VisibleToProfiles(DiscoveryProfile::ReadOnlyHelper)]
final class SecondBudgetReadTool extends JournalReadTool
{
    protected function read(ToolArguments $arguments): ToolResult
    {
        return ToolResult::ok([], []);
    }
}
