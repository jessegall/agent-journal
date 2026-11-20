<?php

declare(strict_types=1);

namespace App\Mcp\Contracts;

use App\Mcp\Tools\JournalTool;

interface JobPermissionReader
{
    public function allows(JournalTool $tool): bool;
}
