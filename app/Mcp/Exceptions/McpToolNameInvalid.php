<?php

declare(strict_types=1);

namespace App\Mcp\Exceptions;

use LogicException;

/**
 * An MCP tool class without a #[Name], or with one that is not snake_case.
 */
final class McpToolNameInvalid extends LogicException
{
    public static function missing(string $className): self
    {
        return new self("The MCP tool {$className} declares no #[Name].");
    }

    public static function notSnakeCase(string $className, string $name): self
    {
        return new self("The MCP tool {$className} is named {$name}; a tool name is snake_case, such as tasks_assigned.");
    }
}
