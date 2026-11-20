<?php

declare(strict_types=1);

namespace App\Supervision\Values;

use App\Profiles\Values\SupervisorCoverage;

final readonly class SupervisorChangeReceipt
{
    /** @param list<SupervisorCoverage> $coverage */
    public function __construct(public int $version, public array $coverage) {}
}
