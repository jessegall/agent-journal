<?php

declare(strict_types=1);

namespace App\Http\Data\Agents;

use App\Bus\Support\Command;
use App\Http\Enums\UsageMeasurementType;
use App\Profiles\Commands\AddUsageCost;
use App\Profiles\Values\ReportedStart;
use App\Profiles\Values\UsageCost;
use App\Profiles\Values\UsageSource;
use App\Profiles\Values\UsdAmount;
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
        return new AddUsageCost($start, new UsageCost($source->id, UsdAmount::from($this->usd), $source->observedAt));
    }
}
