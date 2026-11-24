<?php

declare(strict_types=1);

namespace App\Mcp\Contracts;

/**
 * Where an owner adds its MCP tool, resource and overview contribution classes when the application starts.
 */
interface McpRegistration
{
    /**
     * Adds a tool the journal's MCP server offers, by its class.
     */
    public function registerTool(string $className): void;

    /**
     * Adds a resource the journal's MCP server offers, by its class.
     */
    public function registerResource(string $className): void;

    /**
     * Adds a section to the journal overview, by the class that reads it.
     */
    public function registerOverviewContribution(string $className): void;
}
