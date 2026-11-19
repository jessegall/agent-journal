<?php

declare(strict_types=1);

namespace App\Agents\Support;

/**
 * Liveness evidence a host reports for a runtime: which host, which process generation, and what it saw. It carries no
 * time: the server dates it.
 */
final readonly class RuntimeEvidence
{
    public function __construct(
        public string $hostId,
        public int $processGeneration,
        public string $evidence,
    ) {}
}
