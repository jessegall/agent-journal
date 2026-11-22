<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Values\SupervisorCoverage;
use App\Values\SupervisorProfile;

interface SupervisorDefinitions
{
    /**
     * @param  list<SupervisorProfile>  $proposed
     * @return array<string, list<SupervisorCoverage>>
     */
    public function validate(array $proposed): array;
}
