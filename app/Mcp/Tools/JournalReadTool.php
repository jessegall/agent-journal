<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Access\Contracts\ReadGrant;
use App\Mcp\Contracts\McpCall;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Reads\ReadOnlyStretch;
use App\Reads\ReadOnlyTransaction;
use App\Values\ReadRequest;
use Laravel\Mcp\Request;
use Laravel\Mcp\ResponseFactory;

/**
 * A journal tool that only reads: it hands its checked arguments to one reader and answers with what that returns.
 * A read tool carries #[IsReadOnly].
 */
abstract class JournalReadTool extends JournalTool
{
    /**
     * The read a call of the tool makes, or its discovery when no arguments are given yet.
     */
    public function readRequest(ToolArguments|null $arguments = null): ReadRequest
    {
        if ($arguments === null) {
            return ReadRequest::forDiscovery($this->name());
        }

        return new ReadRequest($this->name());
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

    /**
     * Answers a call of the read tool once the read grant allows it, so its reply is recorded and repeated. The read
     * runs in a read-only stretch and transaction: a command it sends is refused, and so is any write to the database.
     */
    final public function handle(
        Request $request,
        McpCall $call,
        ReadGrant $reads,
        ReadOnlyStretch $stretch,
        ReadOnlyTransaction $transaction,
    ): ResponseFactory {
        return $call->answerTool($this->name(), function () use ($request, $reads, $stretch, $transaction): ToolResult {
            $arguments = $this->arguments($request);
            $reads->assertAllowed($this->readRequest($arguments));

            return $stretch->during(
                "the read tool {$this->name()}",
                fn () => $transaction->run(fn () => $this->read($arguments)),
            );
        });
    }

    /**
     * The tool's answer to the read its arguments ask for.
     */
    abstract protected function read(ToolArguments $arguments): ToolResult;
}
