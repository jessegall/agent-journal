<?php

declare(strict_types=1);

namespace Domain\Documents\Contracts;

use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;

interface ReportReader
{
    public function report(int|string $id, ToolArguments $arguments): ToolResult;
}
