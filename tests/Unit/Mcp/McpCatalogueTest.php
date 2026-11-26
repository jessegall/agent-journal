<?php

declare(strict_types=1);

namespace Tests\Unit\Mcp;

use App\Contracts\Drivers\ToolDiscovery;
use App\Mcp\Exceptions\McpClassInvalid;
use App\Mcp\Exceptions\McpToolNameInvalid;
use App\Mcp\Exceptions\McpToolNameTaken;
use App\Mcp\Servers\JournalServer;
use App\Mcp\Support\McpCatalogue;
use App\Support\AgentContext;
use App\Support\CatalogueReflectorFactory;
use App\Support\CommandRegistry;
use App\Support\DomainRegistry;
use App\Support\SignedCall;
use Carbon\CarbonImmutable;
use Laravel\Mcp\Server\Tool;
use Tests\Fixtures\Domains\Ledger\LedgerDomain;
use Tests\Fixtures\Domains\Ledger\Mcp\KebabLedgerTool;
use Tests\Fixtures\Domains\Ledger\Mcp\LedgerReadTool;
use Tests\Fixtures\Domains\Ledger\Mcp\SecondLedgerReadTool;
use Tests\Fixtures\Mcp\FixtureServer;
use Tests\TestCase;

/**
 * The MCP catalogue: domains add their tools to the journal server, and a wrong declaration stops start-up.
 */
final class McpCatalogueTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->app->instance(
            AgentContext::class,
            new AgentContext('agent-1', 'session-1', new SignedCall('call-1', CarbonImmutable::now(), 'digest'), null),
        );
    }

    public function test_a_domain_tool_appears_in_tools_list(): void
    {
        $catalogue = new McpCatalogue(CommandRegistry::of([]), new CatalogueReflectorFactory(), $this->app);
        DomainRegistry::from([LedgerDomain::class])->registerMcpToolsIn($catalogue);
        $this->app->instance(McpCatalogue::class, $catalogue);
        $this->mock(ToolDiscovery::class)->shouldReceive('recordDiscovery')->once();

        JournalServer::tools()->assertRegistered(LedgerReadTool::class);
    }

    public function test_the_application_starts_with_a_catalogue(): void
    {
        $this->assertInstanceOf(McpCatalogue::class, $this->app->make(McpCatalogue::class));
    }

    public function test_a_second_class_with_the_same_name_fails_naming_both(): void
    {
        $catalogue = new McpCatalogue(CommandRegistry::of([]), new CatalogueReflectorFactory(), $this->app);
        $catalogue->registerTool(LedgerReadTool::class);

        $this->expectException(McpToolNameTaken::class);
        $this->expectExceptionMessage(
            McpToolNameTaken::for('ledger_read', LedgerReadTool::class, SecondLedgerReadTool::class)->getMessage(),
        );

        $catalogue->registerTool(SecondLedgerReadTool::class);
    }

    public function test_a_kebab_name_fails(): void
    {
        $this->expectException(McpToolNameInvalid::class);
        $this->expectExceptionMessage('ledger-read');

        new McpCatalogue(
            CommandRegistry::of([]),
            new CatalogueReflectorFactory(),
            $this->app,
        )->registerTool(KebabLedgerTool::class);
    }

    public function test_a_class_that_is_not_a_journal_tool_fails(): void
    {
        $this->expectException(McpClassInvalid::class);

        new McpCatalogue(
            CommandRegistry::of([]),
            new CatalogueReflectorFactory(),
            $this->app,
        )->registerTool(FixtureServer::class);
    }

    public function test_execute_tools_and_search_tools_are_not_tools_of_the_journal(): void
    {
        foreach (['execute_tools', 'search_tools'] as $name) {
            $named = new class($name) extends Tool
            {
                public function __construct(string $name)
                {
                    $this->name = $name;
                }
            };

            JournalServer::tool($named)->assertNotRegistered();
        }
    }
}
