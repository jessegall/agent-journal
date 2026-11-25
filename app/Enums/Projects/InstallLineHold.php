<?php

declare(strict_types=1);

namespace App\Enums\Projects;

/**
 * What keeps this server from issuing install lines, each with the sentence the Connect a project page shows.
 */
enum InstallLineHold: string
{
    case SwitchedOff = 'switched_off';
    case OriginNotHttps = 'origin_not_https';
    case NoRelease = 'no_release';

    public function sentence(): string
    {
        return match ($this) {
            self::SwitchedOff => 'Switch on Connect projects on other machines in Settings first.',
            self::OriginNotHttps => 'The server address is not an https address; set JOURNAL_SERVER_ORIGIN.',
            self::NoRelease => 'No host release this server can offer is published yet.',
        };
    }
}
