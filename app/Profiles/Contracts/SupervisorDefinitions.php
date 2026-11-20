<?php

declare(strict_types=1);

namespace App\Profiles\Contracts;

use App\Profiles\Values\SupervisorCoverage;
use App\Profiles\Values\SupervisorProfile;

interface SupervisorDefinitions
{
    /**
     * @param list<SupervisorProfile> $proposed
     * @return array<string, list<SupervisorCoverage>>
     */
    public function validate(array $proposed): array;
}
