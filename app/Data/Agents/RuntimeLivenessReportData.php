<?php

declare(strict_types=1);

namespace App\Data\Agents;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * A host's report about a runtime's process: still alive, or verified exited, with what it saw.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class RuntimeLivenessReportData extends Data
{
    public function __construct(
        public readonly string $runtimeId,
        public readonly int $processGeneration,
        public readonly string $evidence,
    ) {}
}
