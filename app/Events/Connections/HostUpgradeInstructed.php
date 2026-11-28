<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Hosts\Contracts\HostUpgradeEvent;

/** The host was sent the upgrade instruction. */
final readonly class HostUpgradeInstructed implements HostUpgradeEvent
{
    public function __construct(public string $hostId) {}
}
