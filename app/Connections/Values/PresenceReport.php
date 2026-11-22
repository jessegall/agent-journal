<?php

declare(strict_types=1);

namespace App\Connections\Values;

use App\Agents\Values\HostDescriptor;

/**
 * One presence report of a binding's relay: the boot that sends it, its monotonic sequence within that boot, the
 * release and protocol it runs, whether it set the folder up, whether it asks to take over from a live boot, the
 * folder's setup generation, the combinations it can run with isolated hooks, start grants and a lease, and whether
 * this boot already reported what became of its earlier sessions.
 */
final readonly class PresenceReport
{
    /**
     * @param  list<HostDescriptor>  $descriptors
     */
    public function __construct(
        public string $bootId,
        public int $sequence,
        public string $release,
        public int $protocol,
        public bool $isProvisioned,
        public bool $takesOver,
        public int $setupGeneration,
        public array $descriptors = [],
        public bool $isReconciled = false,
    ) {}
}
