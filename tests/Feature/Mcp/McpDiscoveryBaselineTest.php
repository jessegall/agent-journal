<?php

declare(strict_types=1);

namespace Tests\Feature\Mcp;

use App\Mcp\Support\McpCatalogue;
use App\Support\DomainRegistry;
use App\Support\ReflectedType;
use Tests\TestCase;

/**
 * Runtime ownership of controllers and MCP discovery: while packages move from src/Mcp to src/Mcp/Tools and
 * src/Mcp/Resources, the MCP server offers exactly the tool names and resource addresses of the layout baseline.
 */
final class McpDiscoveryBaselineTest extends TestCase
{
    /**
     * Every installed domain, since the tools of them all are what this test reads.
     */
    protected static function bootedDomains(): array
    {
        return DomainRegistry::installedClasses(dirname(__DIR__, 3));
    }

    public function test_the_discovered_tools_and_resources_equal_the_baseline(): void
    {
        $catalogue = $this->app->make(McpCatalogue::class);
        $tools = array_map(
            fn (string $tool) => ReflectedType::of($tool)->newInstanceWithoutConstructor()->name(),
            $catalogue->toolClasses(),
        );
        $resources = array_map(
            fn (string $resource) => ReflectedType::of($resource)->newInstanceWithoutConstructor()->uri(),
            $catalogue->resourceClasses(),
        );
        sort($tools);
        sort($resources);

        $this->assertSame(self::baseline('mcp-tools'), $tools);
        $this->assertSame(self::baseline('mcp-resources'), $resources);
        $this->assertContains('tasks_create', $tools);
        $this->assertContains('docs_create', $tools);
        $this->assertContains('journal://v1/reports/{id}', $resources);
    }

    /**
     * @return list<string>
     */
    private static function baseline(string $name): array
    {
        return json_decode(
            (string) file_get_contents(base_path("tools/refactoring/layout/baseline/{$name}.json")),
            true,
            flags: JSON_THROW_ON_ERROR,
        );
    }
}
