<?php

declare(strict_types=1);

namespace App\Connections\Values;

/**
 * One presence report of a binding's relay: the boot that sends it, its monotonic sequence within that boot, the
 * release and protocol it runs, whether it set the folder up, and whether it asks to take over from a live boot.
 */
final readonly class PresenceReport
{
    public function __construct(
        public string $bootId,
        public int $sequence,
        public string $release,
        public int $protocol,
        public bool $isProvisioned,
        public bool $takesOver,
    ) {}
}
