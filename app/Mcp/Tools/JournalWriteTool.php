<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;

/**
 * A journal tool that changes something: it hands its checked arguments to one bus command and answers with the
 * receipt; a refusal of that command is the tool's refusal.
 */
abstract class JournalWriteTool extends JournalTool
{
    final protected function answer(ToolArguments $arguments): ToolResult
    {
        return $this->write($arguments);
    }

    abstract protected function write(ToolArguments $arguments): ToolResult;
}
