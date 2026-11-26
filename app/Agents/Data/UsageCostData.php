<?php

declare(strict_types=1);

namespace App\Agents\Data;

use App\Accounts\Commands\AddUsageCost\AddUsageCostCommand;
use App\Agents\Enums\UsageMeasurementType;
use App\Agents\Values\UsageSource;
use App\Support\Command;
use App\Values\ReportedStart;
use App\Values\UsageCost;
use App\Values\UsdAmount;
use Spatie\LaravelData\Attributes\Validation\Regex;

/**
 * The estimated cost in US dollars of one result a host observed, as a nonnegative decimal of at most 12 decimals.
 */
final class UsageCostData extends UsageMeasurementData
{
    public function __construct(
        #[Regex('/^\d{1,12}(\.\d{1,12})?$/')]
        public readonly string $usd,
    ) {
        $this->type = UsageMeasurementType::ResultCost;
    }

    public function commandFor(ReportedStart $start, UsageSource $source): Command
    {
        return new AddUsageCostCommand(
            $start,
            new UsageCost($source->id, UsdAmount::from($this->usd), $source->observedAt),
        );
    }
}
