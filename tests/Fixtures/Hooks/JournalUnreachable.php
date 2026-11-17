<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use Illuminate\Http\Client\ConnectionException;

/**
 * The connection failure a relay test gives the HTTP client when it plays a journal that is down.
 */
final class JournalUnreachable extends ConnectionException
{
    public static function now(): self
    {
        return new self('The journal is unreachable.');
    }
}
