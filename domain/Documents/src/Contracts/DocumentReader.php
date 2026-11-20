<?php

declare(strict_types=1);

namespace Domain\Documents\Contracts;

use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;

interface DocumentReader
{
    public function document(int|string $id, ToolArguments $arguments): ToolResult;
}
