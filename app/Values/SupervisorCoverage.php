<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\SupervisorCoverageType;

final readonly class SupervisorCoverage
{
    public function __construct(
        public AskTypeKey $type,
        public SupervisorCoverageType $status,
        public string $command,
        public string $reason,
    ) {}
}
