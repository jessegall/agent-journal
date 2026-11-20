<?php

declare(strict_types=1);

namespace Domain\Documents\Contracts;

use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use Domain\Documents\Data\DocumentList;

interface DocumentReader
{
    public function list(string $search, int $page, int $size = 8): DocumentList;

    public function document(int|string $id, ToolArguments $arguments): ToolResult;
}
