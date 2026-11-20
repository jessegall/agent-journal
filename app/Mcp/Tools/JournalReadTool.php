<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Agents\Values\ReadRequest;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;

/**
 * A journal tool that only reads: it hands its checked arguments to one reader and answers with what that returns.
 * A read tool carries #[IsReadOnly].
 */
abstract class JournalReadTool extends JournalTool
{
    public function readRequest(ToolArguments|null $arguments = null): ReadRequest
    {
        return $arguments === null ? ReadRequest::forDiscovery($this->name()) : new ReadRequest($this->name());
    }

    final protected function answer(ToolArguments $arguments): ToolResult
    {
        return $this->read($arguments);
    }

    abstract protected function read(ToolArguments $arguments): ToolResult;
}
