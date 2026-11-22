<?php

declare(strict_types=1);

namespace App\Support\Inspection;

use Spatie\LaravelData\Data;

final class InspectedSubject extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly int $runNumber,
    ) {}
}
