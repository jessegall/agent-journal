<?php

declare(strict_types=1);

namespace App\Mcp\Contracts;

use App\Mcp\Data\ToolResult;
use App\Mcp\Support\Continuation;

interface TextFields
{
    /** @param array<string, string> $text */
    public function start(Continuation $record, array $text): Continuation;

    /** @param array<string, mixed> $summary @param array<string, string> $text */
    public function page(array $summary, array $text, Continuation $position, string $selectorName): ToolResult;
}
