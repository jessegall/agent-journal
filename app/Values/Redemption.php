<?php

declare(strict_types=1);

namespace App\Values;

/**
 * What one redemption of an install line made: the host, the project and its label, the binding of the folder and
 * its main agent.
 */
final readonly class Redemption
{
    public function __construct(
        public string $hostId,
        public string $projectId,
        public string $bindingId,
        public string $mainAgentId,
        public string $projectLabel,
    ) {}
}
