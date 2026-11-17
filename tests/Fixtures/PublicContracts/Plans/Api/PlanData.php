<?php

declare(strict_types=1);

namespace Tests\Fixtures\PublicContracts\Plans\Api;

use Carbon\CarbonImmutable;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

final class PlanData extends Data
{
    public function __construct(
        public readonly string $title,
        public readonly CarbonImmutable $startedAt,
        public readonly PlanStatus|Optional $status = new Optional,
    ) {}
}
