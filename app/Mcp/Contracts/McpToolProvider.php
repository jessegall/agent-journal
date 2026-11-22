<?php

declare(strict_types=1);

namespace App\Mcp\Contracts;

use App\Mcp\Resources\JournalResource;
use App\Mcp\Tools\JournalTool;

/**
 * A domain that offers agents MCP tools, resources and overview sections: their class names, which the journal's MCP
 * catalogue checks.
 */
interface McpToolProvider
{
    /**
     * @return list<class-string<JournalTool>>
     */
    public function mcpTools(): array;

    /**
     * @return list<class-string<JournalResource>>
     */
    public function mcpResources(): array;

    /**
     * @return list<class-string<OverviewContribution>>
     */
    public function overviewContributions(): array;

}
