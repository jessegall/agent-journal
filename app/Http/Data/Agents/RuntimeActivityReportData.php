<?php

declare(strict_types=1);

namespace App\Http\Data\Agents;

use App\Agents\Enums\HoldReason;
use App\Agents\Enums\RuntimeActivity;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * A host's report of a runtime's activity and hold in a process generation.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class RuntimeActivityReportData extends Data
{
    public function __construct(
        public readonly string $runtimeId,
        public readonly RuntimeActivity $activity,
        public readonly HoldReason $hold,
        public readonly int $processGeneration,
    ) {}
}
