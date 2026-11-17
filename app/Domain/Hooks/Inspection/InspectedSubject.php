<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Inspection;

use Spatie\LaravelData\Data;

final class InspectedSubject extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly int $runNumber,
    ) {}
}
