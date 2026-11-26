<?php

declare(strict_types=1);

namespace App\Mcp\Contracts;

use App\Mcp\Tools\JournalTool;

interface JobPermissionReader
{
    /**
     * Whether the current agent's job may use the tool.
     */
    public function allows(JournalTool $tool): bool;
}
