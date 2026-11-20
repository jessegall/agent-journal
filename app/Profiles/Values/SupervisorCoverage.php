<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Profiles\Enums\SupervisorCoverageType;

final readonly class SupervisorCoverage
{
    public function __construct(
        public AskTypeKey $type,
        public SupervisorCoverageType $status,
        public string $operation,
        public string $reason,
    ) {}
}
