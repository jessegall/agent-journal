<?php

declare(strict_types=1);

namespace App\Data\Hooks;

use App\Enums\StopResultType;
use App\Values\StopResultReport;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * One result in a host's stop results body, as validated by its request.
 */
#[MapName(SnakeCaseMapper::class)]
final class StopResultData extends Data
{
    public function __construct(
        public string $conditionKey,
        public string $definitionHash,
        public StopResultType $status,
        public CarbonImmutable $startedAt,
        public CarbonImmutable|null $endedAt,
        public int|null $exitCode,
        public string|null $signal,
        public string $summary,
        public string|null $output,
        public bool $truncated,
    ) {}

    public function report(): StopResultReport
    {
        return new StopResultReport(
            $this->conditionKey,
            $this->definitionHash,
            $this->status,
            $this->startedAt->toIso8601ZuluString('microsecond'),
            $this->endedAt?->toIso8601ZuluString('microsecond'),
            $this->exitCode,
            $this->signal,
            $this->summary,
            $this->output,
            $this->truncated,
        );
    }
}
