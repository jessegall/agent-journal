<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;

/**
 * A journal tool that only reads: it hands its checked arguments to one reader and answers with what that returns.
 * A read tool carries #[IsReadOnly].
 */
abstract class JournalReadTool extends JournalTool
{
    final protected function answer(ToolArguments $arguments): ToolResult
    {
        return $this->read($arguments);
    }

    abstract protected function read(ToolArguments $arguments): ToolResult;
}
