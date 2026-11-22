<?php

declare(strict_types=1);

namespace Tests\Feature\Mcp;

use App\Mcp\Support\McpCatalogue;
use App\Support\Reflector;
use Tests\TestCase;

/**
 * Doc 107, Runtime ownership of controllers and MCP discovery: while packages move from src/Mcp to src/Mcp/Tools and
 * src/Mcp/Resources, the MCP server offers exactly the tool names and resource addresses of the layout baseline.
 */
final class McpDiscoveryBaselineTest extends TestCase
{
    public function test_the_discovered_tools_and_resources_equal_the_baseline(): void
    {
        $catalogue = $this->app->make(McpCatalogue::class);
        $tools = array_map(
            fn (string $tool) => Reflector::of($tool)->newInstanceWithoutConstructor()->name(),
            $catalogue->toolClasses(),
        );
        $resources = array_map(
            fn (string $resource) => Reflector::of($resource)->newInstanceWithoutConstructor()->uri(),
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
