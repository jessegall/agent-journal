<?php

declare(strict_types=1);

namespace App\Data\Agents;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * A host's report of a native turn starting or finishing, by the driver's own prompt id.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class DriverTurnReportData extends Data
{
    public function __construct(
        public readonly string $runtimeId,
        public readonly int $processGeneration,
        public readonly string $nativePromptId,
        public readonly bool $finished,
        public readonly string|null $model,
        public readonly string|null $effort,
        public readonly string|null $outcome,
    ) {}
}
