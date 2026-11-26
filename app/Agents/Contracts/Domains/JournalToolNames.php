<?php

declare(strict_types=1);

namespace App\Agents\Contracts\Domains;

/**
 * The names of the tools the journal's own MCP server offers, so a driver's call to one is recognized by its exact
 * name, never by a prefix.
 */
interface JournalToolNames
{
    /**
     * @return list<string>
     */
    public function toolNames(): array;
}
