<?php

declare(strict_types=1);

namespace App\Events\Connections;

/** The host could not upgrade and stays on its release. */
final readonly class HostUpgradeFailed implements ConnectionEvent
{
    public function __construct(public string $hostId) {}
}
