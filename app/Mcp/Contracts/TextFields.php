<?php

declare(strict_types=1);

namespace App\Mcp\Contracts;

use App\Mcp\Data\ToolResult;
use App\Mcp\Support\Continuation;

interface TextFields
{
    /**
     * @param  array<string, string>  $text
     */
    public function start(Continuation $record, array $text): Continuation;

    /**
     * The position inside one named field, at a line and the character inside it, such as a passage search found.
     *
     * @param  array<string, string>  $text
     */
    public function startAt(Continuation $record, array $text, string $field, int $line, int $character): Continuation;

    /**
     * @param  array<string, mixed>  $summary
     * @param  array<string, string>  $text
     */
    public function page(array $summary, array $text, Continuation $position, string $selectorName): ToolResult;
}
