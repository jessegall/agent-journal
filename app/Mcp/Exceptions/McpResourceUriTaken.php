<?php

declare(strict_types=1);

namespace App\Mcp\Exceptions;

use LogicException;

/**
 * Two MCP resource classes declared with one URI.
 */
final class McpResourceUriTaken extends LogicException
{
    public static function for(string $uri, string $firstClass, string $secondClass): self
    {
        return new self("The MCP resource URI {$uri} is declared by both {$firstClass} and {$secondClass}.");
    }
}
