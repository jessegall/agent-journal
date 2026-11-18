<?php

declare(strict_types=1);

namespace Tests\Support;

use Illuminate\Http\Response;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Agents\TestLaunch;

/**
 * Posts JSON-RPC frames to the journal's MCP route, signed by a test launch as its relay would sign them.
 */
trait SendsMcpFrames
{
    /**
     * @param  array<string, mixed>  $params
     * @param  array<string, string>  $headers
     * @return TestResponse<Response>
     */
    protected function sendMcp(TestLaunch $launch, string $method, array $params = [], array $headers = [], int|null $issuedAt = null): TestResponse
    {
        return $this->sendMcpBody($launch, $this->mcpFrame($method, $params), $headers, $issuedAt);
    }

    /**
     * @param  array<string, string>  $headers
     * @return TestResponse<Response>
     */
    protected function sendMcpBody(TestLaunch $launch, string $body, array $headers = [], int|null $issuedAt = null): TestResponse
    {
        $this->app->forgetScopedInstances();
        $server = [...$launch->serverHeaders($body, 'call-'.bin2hex(random_bytes(4)), $issuedAt, target: '/agent/mcp/v1'), ...$headers];

        return $this->call('POST', '/agent/mcp/v1', server: $server, content: $body);
    }

    /**
     * A tools/call frame for the tool with its arguments.
     *
     * @param  array<string, mixed>  $arguments
     * @param  array<string, string>  $headers
     * @return TestResponse<Response>
     */
    protected function callMcpTool(TestLaunch $launch, string $name, array $arguments = [], array $headers = []): TestResponse
    {
        return $this->sendMcp($launch, 'tools/call', ['name' => $name, 'arguments' => (object) $arguments], $headers)->assertOk();
    }

    /**
     * @param  array<string, mixed>  $params
     */
    protected function mcpFrame(string $method, array $params = []): string
    {
        return json_encode(['jsonrpc' => '2.0', 'id' => 1, 'method' => $method, 'params' => (object) $params], JSON_THROW_ON_ERROR);
    }
}
