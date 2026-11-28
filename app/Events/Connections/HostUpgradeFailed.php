<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Hosts\Contracts\HostUpgradeEvent;

/** The host could not upgrade and stays on its release. */
final readonly class HostUpgradeFailed implements HostUpgradeEvent
{
    public function __construct(public string $hostId) {}
}
