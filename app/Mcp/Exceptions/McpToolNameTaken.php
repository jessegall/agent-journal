<?php

declare(strict_types=1);

namespace App\Mcp\Exceptions;

use LogicException;

/**
 * Two MCP tool classes declared with one name.
 */
final class McpToolNameTaken extends LogicException
{
    public static function for(string $name, string $firstClass, string $secondClass): self
    {
        return new self("The MCP tool name {$name} is declared by both {$firstClass} and {$secondClass}.");
    }
}
