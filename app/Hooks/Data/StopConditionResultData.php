<?php

declare(strict_types=1);

namespace App\Hooks\Data;

use App\Sessions\Enums\StopConditionResultType;
use App\Values\StopConditionResultReport;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * One result in a host's stop results body, as validated by its request.
 */
#[MapName(SnakeCaseMapper::class)]
final class StopConditionResultData extends Data
{
    public function __construct(
        public readonly string $conditionKey,
        public readonly string $definitionHash,
        public readonly StopConditionResultType $status,
        public readonly CarbonImmutable $startedAt,
        public readonly CarbonImmutable|null $endedAt,
        public readonly int|null $exitCode,
        public readonly string|null $signal,
        public readonly string $summary,
        public readonly string|null $output,
        #[MapInputName('truncated')]
        public readonly bool $isTruncated,
    ) {}

    public function report(): StopConditionResultReport
    {
        return new StopConditionResultReport(
            $this->conditionKey,
            $this->definitionHash,
            $this->status,
            $this->startedAt->toIso8601ZuluString('microsecond'),
            $this->endedAt?->toIso8601ZuluString('microsecond'),
            $this->exitCode,
            $this->signal,
            $this->summary,
            $this->output,
            $this->isTruncated,
        );
    }
}
