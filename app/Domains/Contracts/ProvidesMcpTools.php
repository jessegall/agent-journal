<?php

declare(strict_types=1);

namespace App\Domains\Contracts;

use App\Mcp\Resources\JournalResource;
use App\Mcp\Tools\JournalTool;

/**
 * A domain that offers agents MCP tools and resources: their class names, which the journal's MCP catalogue checks.
 */
interface ProvidesMcpTools
{
    /**
     * @return list<class-string<JournalTool>>
     */
    public function mcpTools(): array;

    /**
     * @return list<class-string<JournalResource>>
     */
    public function mcpResources(): array;
}
