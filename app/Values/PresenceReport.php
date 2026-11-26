<?php

declare(strict_types=1);

namespace App\Values;

/**
 * One presence report of a binding's relay: its boot and sequence, its release, whether it set the folder up or asks to
 * take over a live boot, the folder's setup generation, what it can run, and whether it reported what became of its
 * earlier sessions.
 */
final readonly class PresenceReport
{
    public function __construct(
        public string $bootId,
        public int $sequence,
        public string $release,
        public bool $isProvisioned,
        public bool $takesOver,
        public int $setupGeneration,
        public bool $isReconciled = false,
    ) {}
}
