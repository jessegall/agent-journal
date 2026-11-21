<?php

declare(strict_types=1);

namespace App\Http\Data\Agents;

use App\Bus\Support\Command;
use App\Http\Enums\UsageMeasurementType;
use App\Profiles\Values\ReportedStart;
use App\Profiles\Values\UsageSource;
use Spatie\LaravelData\Attributes\PropertyForMorph;
use Spatie\LaravelData\Contracts\PropertyMorphableData;
use Spatie\LaravelData\Data;

/**
 * The measurement of one usage report, read by its type into the data of that type.
 */
abstract class UsageMeasurementData extends Data implements PropertyMorphableData
{
    #[PropertyForMorph]
    public UsageMeasurementType $type;

    /**
     * @param  array{type: UsageMeasurementType}  $properties
     */
    public static function morph(array $properties): string
    {
        return match ($properties['type']) {
            UsageMeasurementType::Window => UsageWindowData::class,
            UsageMeasurementType::ResultCost => UsageCostData::class,
            UsageMeasurementType::ThreadTokens => ThreadTokensData::class,
        };
    }

    /**
     * The command that keeps this measurement for the reported start, observed at the source.
     *
     * @return Command<null>
     */
    abstract public function commandFor(ReportedStart $start, UsageSource $source): Command;
}
