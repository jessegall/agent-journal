<?php

declare(strict_types=1);

namespace App\Mcp\Exceptions;

use LogicException;

/**
 * A class registered as an MCP tool or resource that does not extend the journal's base for it.
 */
final class McpClassInvalid extends LogicException
{
    public static function for(string $className, string $baseClass): self
    {
        return new self("The MCP class {$className} must extend {$baseClass}.");
    }
}
