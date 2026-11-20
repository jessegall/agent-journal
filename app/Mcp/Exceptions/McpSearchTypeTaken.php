<?php

declare(strict_types=1);

namespace App\Mcp\Exceptions;

use LogicException;

final class McpSearchTypeTaken extends LogicException
{
    public static function between(string $type, string $first, string $second): self
    {
        return new self("MCP search type {$type} is provided by both {$first} and {$second}.");
    }
}
