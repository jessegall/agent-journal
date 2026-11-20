<?php

declare(strict_types=1);

namespace Domain\Documents\Contracts;

use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use Domain\Documents\Data\ReportList;
use Domain\Documents\Enums\ReportState;

interface ReportReader
{
    public function list(string $search, ReportState $state, int $page, int $size = 8): ReportList;

    public function report(int|string $id, ToolArguments $arguments): ToolResult;

}
