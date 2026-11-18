<?php

declare(strict_types=1);

namespace Tests\Fixtures\Mcp\Exceptions;

use RuntimeException;

/**
 * A fixture failure the journal did not name for its caller, with a detail the caller must never see.
 */
final class FixtureReaderBroke extends RuntimeException
{
    public static function withSecret(): self
    {
        return new self('secret detail of the database');
    }
}
