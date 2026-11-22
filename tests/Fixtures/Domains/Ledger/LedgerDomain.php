<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Ledger;

use App\Support\Domain;
use App\Support\Exports;
use App\Mcp\Contracts\McpToolProvider;
use Tests\Fixtures\Domains\Ledger\Mcp\LedgerReadTool;

/**
 * A fixture domain that offers agents one MCP read tool.
 */
final class LedgerDomain extends Domain implements McpToolProvider
{
    public function description(): string
    {
        return 'A fixture domain with an MCP tool.';
    }

    public function requires(): array
    {
        return [];
    }

    public function exports(): Exports
    {
        return Exports::make()->build();
    }

    public function mcpTools(): array
    {
        return [LedgerReadTool::class];
    }

    public function mcpResources(): array
    {
        return [];
    }

    public function overviewContributions(): array
    {
        return [];
    }

    public function searchContributions(): array
    {
        return [];
    }
}
