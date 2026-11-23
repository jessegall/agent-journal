<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * The journal's MCP entry would name a path that is empty, relative or a placeholder, or a value that looks like a
 * secret; nothing is written.
 */
final class JournalServerUnresolved extends RuntimeException
{
    public static function for(string $url): self
    {
        return new self(
            sprintf('The journal MCP entry cannot name "%s": only fixed absolute paths are written.', $url),
        );
    }
}
