<?php

declare(strict_types=1);

namespace App\CommandRules\Mcp\Contracts;

use App\CommandRules\Mcp\Tools\JournalTool;

interface JobPermissionReader
{
    /**
     * Whether the current agent's job may use the tool.
     */
    public function allows(JournalTool $tool): bool;
}
