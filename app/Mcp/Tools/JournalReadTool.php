<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Mcp\Data\ToolResult;
use App\Mcp\Support\McpCall;
use App\Mcp\Support\ToolArguments;
use Laravel\Mcp\Request;
use Laravel\Mcp\ResponseFactory;

/**
 * A journal tool that only reads: it hands its checked arguments to one reader and answers with what that returns.
 * A read tool carries #[IsReadOnly].
 */
abstract class JournalReadTool extends JournalTool
{
    final public function handle(Request $request, McpCall $call): ResponseFactory
    {
        return $call->answerTool($this->name(), fn (): ToolResult => $this->read($this->arguments($request)));
    }

    abstract protected function read(ToolArguments $arguments): ToolResult;
}
