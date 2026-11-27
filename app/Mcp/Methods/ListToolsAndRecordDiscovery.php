<?php

declare(strict_types=1);

namespace App\Mcp\Methods;

use App\Agents\Drivers\Contracts\ToolDiscovery;
use App\Mcp\Support\McpCatalogue;
use App\Support\AgentContext;
use Laravel\Mcp\Server\Methods\ListTools;
use Laravel\Mcp\Server\ServerContext;
use Laravel\Mcp\Transport\JsonRpcRequest;
use Laravel\Mcp\Transport\JsonRpcResponse;

/**
 * The package's tools/list, which also records that the signed caller's driver discovered its tools.
 */
final class ListToolsAndRecordDiscovery extends ListTools
{
    public function __construct(
        private readonly AgentContext $agent,
        private readonly ToolDiscovery $discovery,
        private readonly McpCatalogue $catalogue,
    ) {}

    /**
     * The tools the start's transport offers, recording the discovery only when it offers some: a CLI start's empty
     * list is no discovery.
     */
    public function handle(JsonRpcRequest $request, ServerContext $context): JsonRpcResponse
    {
        $response = parent::handle($request, $context);

        if ($this->catalogue->forTransport($this->agent->transport)->offersTools()) {
            $this->discovery->recordDiscovery($this->agent->sessionId, $this->agent->call->issuedAt);
        }

        return $response;
    }
}
