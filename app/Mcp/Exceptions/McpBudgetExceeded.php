<?php

declare(strict_types=1);

namespace App\Mcp\Exceptions;

use LogicException;

/**
 * A job profile whose tools are more, or larger, than its discovery budget.
 */
final class McpBudgetExceeded extends LogicException
{
    public static function tools(string $profile, int $count, int $limit): self
    {
        return new self("The {$profile} profile has {$count} MCP tools; its budget is {$limit}.");
    }

    public static function bytes(string $profile, int $bytes, int $limit): self
    {
        return new self("The {$profile} profile's MCP tool definitions take {$bytes} bytes; its budget is {$limit}.");
    }
}
