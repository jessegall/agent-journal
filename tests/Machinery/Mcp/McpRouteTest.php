<?php

declare(strict_types=1);

namespace Tests\Machinery\Mcp;

use App\Agents\Drivers\Contracts\ToolDiscovery;
use App\Mcp\Servers\JournalServer;
use Illuminate\Support\Facades\Route;
use Laravel\Mcp\Server\Registrar;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\TestCase;

/**
 * The journal's MCP server on its signed route: who may reach it, what it advertises, and which messages it refuses
 * before the package reads them.
 */
#[TestsMachinery(JournalServer::class)]
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

    public function test_a_start_on_mcp_transport_lists_the_journals_tools_and_records_its_discovery(): void
    {
        $listed = $this->journal->mcpRequest('Test agent', 'tools/list')->assertOk()->json('result.tools');

        $this->assertNotSame([], $listed);
        $this->assertTrue($this->hasDiscovered('Test agent'));
    }

    public function test_a_replaced_start_is_refused_on_either_transport(): void
    {
        foreach (['mcp', 'cli'] as $transport) {
            config(['journal.agents.transport_profile' => $transport]);
            $this->journal->idleAgent("{$transport} writer")
                ->startSession("{$transport} writer", "{$transport} first")
                ->startSession("{$transport} writer", "{$transport} second");

            $this->journal->mcpRequest("{$transport} first", 'tools/list')->assertUnauthorized();
        }
    }

    private function hasDiscovered(string $start): bool
    {
        $session = $this->journal->sessionCalled($start);

        return $this->journal->service(ToolDiscovery::class)->isDiscoveredInCurrentGeneration($session->id);
    }

    public function test_the_server_is_a_web_route_and_has_no_stdio_handle(): void
    {
        $registrar = $this->app->make(Registrar::class);

        $this->assertNotNull($registrar->getWebServer('agent/mcp/v1'));
        $this->assertNull($registrar->getLocalServer('journal'));
        $this->artisan('mcp:start', ['handle' => 'journal'])->assertFailed();
    }
}
