<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Ledger\Mcp;

use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalReadTool;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

/**
 * Reads a ledger entry under a kebab name.
 */
#[IsReadOnly]
#[Name('ledger-read')]
#[Description('Reads a ledger entry under a kebab name.')]
final class KebabLedgerTool extends JournalReadTool
{
    protected function read(ToolArguments $arguments): ToolResult
    {
        return ToolResult::ok([], []);
    }
}
