<?php

declare(strict_types=1);

namespace App\Mcp\Exceptions;

use LogicException;

final class McpCommandMissing extends LogicException
{
    public static function for(string $tool, string $command): self
    {
        return new self("The MCP write tool {$tool} declares command {$command}, which has no registered handler.");
    }

    public static function undeclared(string $tool): self
    {
        return new self("The MCP write tool {$tool} must declare its command with #[Dispatches].");
    }
}
