<?php

declare(strict_types=1);

namespace App\Mcp\Contracts;

use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;

/**
 * What the search tool runs: its arguments, its description and its answer, chosen once by configuration.
 */
interface SearchEntry
{
    /**
     * @return array<string, mixed>
     */
    public function schema(JsonSchema $schema): array;

    public function description(): string;

    public function search(ToolArguments $arguments): ToolResult;
}
