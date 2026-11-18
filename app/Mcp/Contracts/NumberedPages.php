<?php

declare(strict_types=1);

namespace App\Mcp\Contracts;

use App\Mcp\Data\ToolResult;
use App\Mcp\Exceptions\ContinuationInvalid;
use App\Mcp\Exceptions\ContinuationStale;
use App\Mcp\Support\ListedPage;
use App\Mcp\Support\ToolArguments;
use Closure;

/**
 * Answers a numbered list tool: a first page read from the tool's filters, or the continuation of a page the byte
 * budget shortened.
 */
interface NumberedPages
{
    /**
     * @param  Closure(ToolArguments): array<string, mixed>  $filtersOf  the first-page filters, with the page number under page
     * @param  Closure(array<string, mixed>): ListedPage  $read  the owner's reader for those filters
     *
     * @throws ContinuationInvalid
     * @throws ContinuationStale
     */
    public function answer(string $tool, ToolArguments $arguments, Closure $filtersOf, Closure $read): ToolResult;
}
