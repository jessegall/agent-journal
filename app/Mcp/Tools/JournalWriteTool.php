<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Mcp\Contracts\McpCall;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use Laravel\Mcp\Request;
use Laravel\Mcp\ResponseFactory;

/**
 * A journal tool that changes something: it hands its checked arguments to one bus command and answers with the
 * receipt; a refusal of that command is the tool's refusal.
 */
abstract class JournalWriteTool extends JournalTool
{
    final public function handle(Request $request, McpCall $call): ResponseFactory
    {
        return $call->answerTool($this->name(), fn (): ToolResult => $this->write($this->arguments($request)));
    }

    abstract protected function write(ToolArguments $arguments): ToolResult;
}
