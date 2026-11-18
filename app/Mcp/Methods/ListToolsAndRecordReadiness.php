<?php

declare(strict_types=1);

namespace App\Mcp\Methods;

use App\Agents\Contracts\LaunchReadiness;
use App\Agents\Support\AgentContext;
use Laravel\Mcp\Server\Methods\ListTools;
use Laravel\Mcp\Server\ServerContext;
use Laravel\Mcp\Transport\JsonRpcRequest;
use Laravel\Mcp\Transport\JsonRpcResponse;

/**
 * The package's tools/list, which also records that the signed caller's program discovered its tools.
 */
final class ListToolsAndRecordReadiness extends ListTools
{
    public function __construct(private readonly AgentContext $agent, private readonly LaunchReadiness $readiness) {}

    public function handle(JsonRpcRequest $request, ServerContext $context): JsonRpcResponse
    {
        $response = parent::handle($request, $context);
        $this->readiness->recordDiscovery($this->agent->sessionId, $this->agent->call->issuedAt);

        return $response;
    }
}
