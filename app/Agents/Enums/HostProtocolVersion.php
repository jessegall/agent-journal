<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * The versions of the protocol the journal and its hosts speak; host.ProtocolVersion in tools/journal-agent holds the
 * current one, and both change together in a release.
 */
enum HostProtocolVersion: int
{
    case First = 1;

    public static function current(): self
    {
        return self::First;
    }
}
