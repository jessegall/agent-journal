<?php

declare(strict_types=1);

namespace Domain\Documents\Contracts\Documents;

use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;

interface DocumentReader
{
    /**
     * The document as a tool answer, in the part the arguments ask for.
     */
    public function document(int|string $id, ToolArguments $arguments): ToolResult;
}
