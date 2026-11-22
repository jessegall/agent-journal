<?php

declare(strict_types=1);

namespace App\Values;

final readonly class SupervisorChangeReceipt
{
    /**
     * @param  list<SupervisorCoverage>  $coverage
     */
    public function __construct(public int $version, public array $coverage) {}
}
