<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Ledger;

use App\Domains\Contracts\ProvidesMcpTools;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use Tests\Fixtures\Domains\Ledger\Mcp\LedgerReadTool;

/**
 * A fixture domain that offers agents one MCP read tool.
 */
final class LedgerDomain extends Domain implements ProvidesMcpTools
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
}
