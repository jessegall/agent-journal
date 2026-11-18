<?php

declare(strict_types=1);

namespace App\Mcp\Contracts;

/**
 * Where an owner adds its MCP tool and resource classes when the application starts.
 */
interface McpRegistration
{
    public function registerTool(string $className): void;

    public function registerResource(string $className): void;
}
