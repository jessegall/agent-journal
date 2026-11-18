<?php

declare(strict_types=1);

namespace App\Mcp\Exceptions;

use RuntimeException;
use Throwable;

/**
 * An unexpected failure inside an MCP call, reported with the correlation id the caller was shown.
 */
final class McpCallFailed extends RuntimeException
{
    public static function for(string $subject, string $correlationId, Throwable $failure): self
    {
        return new self("The MCP call of {$subject} with correlation id {$correlationId} failed.", previous: $failure);
    }
}
