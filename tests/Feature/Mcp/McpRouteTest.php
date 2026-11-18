<?php

declare(strict_types=1);

namespace Tests\Feature\Mcp;

use Illuminate\Support\Facades\Route;
use Illuminate\Testing\TestResponse;
use Laravel\Mcp\Server\Registrar;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * The journal's MCP server on its signed route: who may reach it, what it advertises, and which messages it refuses
 * before the package reads them.
 */
final class McpRouteTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['agents', 'agent_sessions', 'launch_credentials'];

    private const string ROUTE = '/agent/mcp/v1';

    private TestLaunch $launch;

    protected function setUp(): void
    {
        parent::setUp();

        $this->launch = TestLaunch::start();
    }

    public function test_a_signed_initialize_answers_with_the_journal_server_and_only_tools_and_resources(): void
    {
        $result = $this->signed('initialize', ['protocolVersion' => '2025-11-25', 'capabilities' => (object) [], 'clientInfo' => ['name' => 'test', 'version' => '1']])
            ->assertOk()
            ->json('result');

        $this->assertSame('journal', $result['serverInfo']['name']);
        $this->assertSame('1.0.0', $result['serverInfo']['version']);
        $this->assertSame(['tools' => ['listChanged' => false], 'resources' => ['listChanged' => false]], $result['capabilities']);
        $this->assertLessThan(2000, mb_strlen($result['instructions']));
        $this->assertStringStartsWith('Use overview_read first.', $result['instructions']);
    }

    public function test_an_unsigned_post_gets_401(): void
    {
        $this->call('POST', self::ROUTE, server: ['CONTENT_TYPE' => 'application/json', 'HTTP_ACCEPT' => 'application/json'], content: $this->frame('initialize'))
            ->assertUnauthorized();
    }

    public function test_a_300_kib_body_is_refused_before_the_server_runs(): void
    {
        $this->assertSame(413, $this->signedBody(json_encode(['jsonrpc' => '2.0', 'id' => 1, 'method' => 'ping', 'params' => ['filler' => str_repeat('a', 300 * 1024)]]))->status());
    }

    public function test_a_message_nested_deeper_than_32_levels_is_refused_with_400(): void
    {
        $deep = str_repeat('[', 40).str_repeat(']', 40);

        $this->assertSame(400, $this->signedBody('{"jsonrpc":"2.0","id":1,"method":"ping","params":{"deep":'.$deep.'}}')->status());
    }

    public function test_a_message_at_the_limits_is_served(): void
    {
        $this->signed('ping')->assertOk();
    }

    public function test_the_server_is_a_web_route_and_has_no_stdio_handle(): void
    {
        $registrar = $this->app->make(Registrar::class);

        $this->assertNotNull($registrar->getWebServer('agent/mcp/v1'));
        $this->assertNull($registrar->getLocalServer('journal'));
        $this->artisan('mcp:start', ['handle' => 'journal'])->assertFailed();
    }

    public function test_the_route_runs_the_agent_check_the_message_limit_and_the_rate_limit_after_the_package_middleware(): void
    {
        $route = Route::getRoutes()->getByName('mcp.journal');

        $this->assertSame(['POST'], $route->methods());
        $this->assertSame(['journal.agent', 'App\Http\Middleware\Mcp\LimitMcpMessage', 'throttle:journal-mcp'], array_slice($route->middleware(), -3));
        $this->assertContains('Laravel\Mcp\Server\Middleware\ValidateOrigin', $route->middleware());
        $this->assertContains('Laravel\Mcp\Server\Middleware\ValidateMcpHeaders', $route->middleware());
    }

    public function test_prompts_list_is_empty(): void
    {
        $this->signed('prompts/list')->assertOk()->assertJsonPath('result.prompts', []);
    }

    public function test_tools_and_resources_start_empty(): void
    {
        $this->signed('tools/list')->assertOk()->assertJsonPath('result.tools', []);
        $this->signed('resources/list')->assertOk()->assertJsonPath('result.resources', []);
    }

    public function test_a_per_request_2026_07_28_request_with_its_mcp_headers_is_served(): void
    {
        $meta = ['io.modelcontextprotocol/protocolVersion' => '2026-07-28', 'io.modelcontextprotocol/clientCapabilities' => (object) []];
        $headers = ['HTTP_MCP_PROTOCOL_VERSION' => '2026-07-28', 'HTTP_MCP_METHOD' => 'server/discover'];

        $response = $this->signed('server/discover', ['_meta' => $meta], $headers)->assertOk();

        $this->assertSame(['2026-07-28'], $response->json('result.supportedVersions'));
        $this->assertSame(['tools', 'resources'], array_keys($response->json('result.capabilities')));
    }

    public function test_a_per_request_2026_07_28_request_without_its_mcp_headers_is_refused(): void
    {
        $meta = ['io.modelcontextprotocol/protocolVersion' => '2026-07-28', 'io.modelcontextprotocol/clientCapabilities' => (object) []];

        $this->signed('server/discover', ['_meta' => $meta])->assertStatus(400);
    }

    public function test_the_121st_call_of_a_session_in_a_minute_gets_429_with_retry_after_seconds(): void
    {
        for ($call = 0; $call < 120; $call++) {
            $this->signed('ping')->assertOk();
        }

        $this->signed('ping')->assertStatus(429)->assertJsonStructure(['retry_after_seconds']);
    }

    /**
     * @param  array<string, mixed>  $params
     * @param  array<string, string>  $headers
     */
    private function signed(string $method, array $params = [], array $headers = []): TestResponse
    {
        return $this->signedBody($this->frame($method, $params), $headers);
    }

    /**
     * @param  array<string, string>  $headers
     */
    private function signedBody(string $body, array $headers = []): TestResponse
    {
        $this->app->forgetScopedInstances();
        $server = [...$this->launch->serverHeaders($body, 'call-'.bin2hex(random_bytes(4)), target: self::ROUTE), ...$headers];

        return $this->call('POST', self::ROUTE, server: $server, content: $body);
    }

    /**
     * @param  array<string, mixed>  $params
     */
    private function frame(string $method, array $params = []): string
    {
        return json_encode(['jsonrpc' => '2.0', 'id' => 1, 'method' => $method, 'params' => (object) $params], JSON_THROW_ON_ERROR);
    }
}
