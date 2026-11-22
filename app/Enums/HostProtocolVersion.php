<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * The versions of the protocol the journal and its hosts speak; host.ProtocolVersion in tools/journal-agent holds the
 * one an enrolled host speaks and client.RemoteProjectProtocolVersion the one of a connected project's relay. Each
 * pair changes together in a release.
 */
enum HostProtocolVersion: int
{
    case First = 1;
    case RemoteProject = 2;

    /**
     * The protocol an enrolled host, local or contained, speaks.
     */
    public static function current(): self
    {
        return self::First;
    }

    /**
     * Every protocol version this journal speaks, oldest first.
     *
     * @return list<int>
     */
    public static function spoken(): array
    {
        return array_map(fn (self $version) => $version->value, self::cases());
    }
}
