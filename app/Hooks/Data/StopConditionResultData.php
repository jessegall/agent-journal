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
        public string $conditionKey,
        public string $definitionHash,
        public StopConditionResultType $status,
        public CarbonImmutable $startedAt,
        public CarbonImmutable|null $endedAt,
        public int|null $exitCode,
        public string|null $signal,
        public string $summary,
        public string|null $output,
        #[MapInputName('truncated')]
        public bool $isTruncated,
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
