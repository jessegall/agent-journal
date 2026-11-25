<?php

declare(strict_types=1);

namespace App\Data\Agents;

use App\Commands\Accounts\RecordUsageWindow\RecordUsageWindowCommand;
use App\Enums\Accounts\UsageWindowSlot;
use App\Enums\Agents\UsageMeasurementType;
use App\Support\Command;
use App\Values\ReportedStart;
use App\Values\UsageSource;
use App\Values\UsageWindowReading;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\Validation\Between;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * A limit window a host observed: the provider's limit, the window, its used percent from 0 to 100, its length in
 * minutes and when it resets, each but the limit and window only when the driver reported it.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class UsageWindowData extends UsageMeasurementData
{
    public function __construct(
        #[Max(64)]
        public readonly string $limitId,
        public readonly UsageWindowSlot $slot,
        #[Between(0, 100)]
        public readonly float|null $usedPercent,
        #[Min(1), Max(527040)]
        public readonly int|null $windowMinutes,
        public readonly CarbonImmutable|null $resetsAt,
    ) {
        $this->type = UsageMeasurementType::Window;
    }

    public function commandFor(ReportedStart $start, UsageSource $source): Command
    {
        $reading = new UsageWindowReading(
            $this->limitId,
            $this->slot,
            $this->usedPercent,
            $this->windowMinutes,
            $this->resetsAt?->getTimestamp(),
            $source,
        );

        return new RecordUsageWindowCommand($start, $reading);
    }
}
