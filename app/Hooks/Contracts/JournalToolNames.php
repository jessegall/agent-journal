<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

/**
 * The names of the tools the journal's own MCP server offers, so a program's call to one is recognized by its exact
 * name, never by a prefix.
 */
interface JournalToolNames
{
    /**
     * @return list<string>
     */
    public function toolNames(): array;
}
