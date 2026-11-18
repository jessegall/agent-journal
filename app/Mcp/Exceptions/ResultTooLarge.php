<?php

declare(strict_types=1);

namespace App\Mcp\Exceptions;

use RuntimeException;

/**
 * A tool result over its byte budget: the reader behind the tool returned more than one call may carry.
 */
final class ResultTooLarge extends RuntimeException
{
    public static function for(string $part, int $bytes, int $limit): self
    {
        return new self("The {$part} of a tool result is {$bytes} bytes, over its budget of {$limit} bytes.");
    }
}
