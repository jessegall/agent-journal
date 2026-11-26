<?php

declare(strict_types=1);

namespace Tests\Machinery\Mcp;

use Illuminate\Support\Facades\Route;
use Laravel\Mcp\Server\Registrar;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * The journal's MCP server on its signed route: who may reach it, what it advertises, and which messages it refuses
 * before the package reads them.
 */
final class McpRouteTest extends TestCase
{
    use CommitsHookRows;

    private TestStart $start;

    private const array TABLES = ['agents', 'agent_sessions', 'session_tokens'];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->idleAgent('Test agent')->startSession('Test agent', 'Test agent');
        $this->start = $this->journal->testStartCalled('Test agent');
    }

    public function test_the_server_is_a_web_route_and_has_no_stdio_handle(): void
    {
        $registrar = $this->app->make(Registrar::class);

        $this->assertNotNull($registrar->getWebServer('agent/mcp/v1'));
        $this->assertNull($registrar->getLocalServer('journal'));
        $this->artisan('mcp:start', ['handle' => 'journal'])->assertFailed();
    }
}
