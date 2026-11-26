<?php

declare(strict_types=1);

namespace App\Agents\Data;

use App\Agents\Enums\UsageMeasurementType;
use App\Agents\Values\UsageSource;
use App\Support\Command;
use App\Values\ReportedStart;
use Spatie\LaravelData\Attributes\PropertyForMorph;
use Spatie\LaravelData\Contracts\PropertyMorphableData;
use Spatie\LaravelData\Data;

/**
 * The measurement of one usage report, read by its type into the data of that type.
 */
abstract class UsageMeasurementData extends Data implements PropertyMorphableData
{
    /**
     * The property the data is morphed by, as the library hands it to morph() before any data exists.
     */
    private const string MORPHED_BY = 'type';

    #[PropertyForMorph]
    public UsageMeasurementType $type;

    /**
     * @param  array{type: UsageMeasurementType}  $properties
     */
    public static function morph(array $properties): string
    {
        return match ($properties[self::MORPHED_BY]) {
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
