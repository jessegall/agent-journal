<?php

declare(strict_types=1);

namespace Domain\Documents\Contracts\Reports;

use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;

interface ReportReader
{
    /**
     * The report as a tool answer, in the part the arguments ask for.
     */
    public function report(int|string $id, ToolArguments $arguments): ToolResult;
}
