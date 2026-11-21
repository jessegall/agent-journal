<?php

declare(strict_types=1);

namespace App\Http\Data\Agents;

use App\Bus\Support\Command;
use App\Profiles\Values\ReportedStart;
use App\Profiles\Values\UsageSource;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\Validation\BeforeOrEqual;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Casts\DateTimeInterfaceCast;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * A host's report of one usage measurement on a start it claimed: the start, the sign-in generation the start ran in,
 * the source that made it with its order, and the UTC time it was observed, which may be long past but not ahead.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class UsageReportData extends Data
{
    public function __construct(
        #[Max(64)]
        public readonly string $startKey,
        #[Min(1)]
        public readonly int $generation,
        #[Max(128)]
        public readonly string $sourceId,
        #[Min(0)]
        public readonly int $sourceOrder,
        #[BeforeOrEqual('+5 minutes')]
        #[WithCast(DateTimeInterfaceCast::class, format: [DATE_ATOM, 'Y-m-d\TH:i:s.uP'])]
        public readonly CarbonImmutable $observedAt,
        public readonly UsageMeasurementData $measurement,
    ) {}

    /**
     * The command that keeps the measurement for the start this host claimed.
     *
     * @return Command<null>
     */
    public function commandFor(string $hostId): Command
    {
        $start = new ReportedStart($hostId, $this->startKey, $this->generation);
        $source = new UsageSource($this->sourceId, $this->sourceOrder, $this->observedAt);

        return $this->measurement->commandFor($start, $source);
    }
}
