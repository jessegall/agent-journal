<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Contracts\ReadGrant;
use App\Mcp\Contracts\McpCall;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Values\ReadRequest;
use Laravel\Mcp\Request;
use Laravel\Mcp\ResponseFactory;

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

    /**
     * The read of one record, targeted at the record the id argument names so a grant scoped to it admits it.
     */
    protected function recordReadRequest(ToolArguments|null $arguments, string $idArgument): ReadRequest
    {
        if ($arguments === null) {
            return ReadRequest::forDiscovery($this->name());
        }

        return ReadRequest::forRecord($this->name(), $idArgument, $arguments->ulid($idArgument));
    }

    final public function handle(Request $request, McpCall $call, ReadGrant $reads): ResponseFactory
    {
        return $call->answerTool($this->name(), function () use ($request, $reads): ToolResult {
            $arguments = $this->arguments($request);
            $reads->assertAllowed($this->readRequest($arguments));

            return $this->read($arguments);
        });
    }

    abstract protected function read(ToolArguments $arguments): ToolResult;
}
