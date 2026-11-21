<?php

declare(strict_types=1);

namespace App\Connections\Values;

use App\Agents\Values\HostCombination;

/**
 * One presence report of a binding's relay: the boot that sends it, its monotonic sequence within that boot, the
 * release and protocol it runs, whether it set the folder up, whether it asks to take over from a live boot, the
 * folder's setup generation, and the combinations it can run with isolated hooks, start grants and a lease.
 */
final readonly class PresenceReport
{
    /**
     * @param  list<HostCombination>  $combinations
     */
    public function __construct(
        public string $bootId,
        public int $sequence,
        public string $release,
        public int $protocol,
        public bool $isProvisioned,
        public bool $takesOver,
        public int $setupGeneration,
        public array $combinations = [],
    ) {}
}
