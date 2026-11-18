<?php

declare(strict_types=1);

namespace App\Agents\Support;

/**
 * A host's verified report that a runtime's program ended: which host, which process generation, and how it knows. It carries no time: the server dates it.
 */
final readonly class RuntimeExit
{
    public function __construct(
        public string $hostId,
        public int $processGeneration,
        public string $evidence,
    ) {}
}
