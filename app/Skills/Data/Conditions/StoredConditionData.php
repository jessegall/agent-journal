<?php

declare(strict_types=1);

namespace App\Skills\Data\Conditions;

use App\Skills\Conditions\AllOf;
use App\Skills\Conditions\AnyOf;
use App\Skills\Conditions\Everyone;
use App\Skills\Conditions\Named;
use App\Skills\Conditions\Not;
use Spatie\LaravelData\Attributes\PropertyForMorph;
use Spatie\LaravelData\Contracts\PropertyMorphableData;
use Spatie\LaravelData\Data;

/**
 * A skill condition as a revision stores it, in the wire format ConditionTree reads: each node chosen by its type.
 * ConditionTree validates it and turns it into the condition that is evaluated.
 */
abstract class StoredConditionData extends Data implements PropertyMorphableData
{
    /**
     * The property the data is morphed by, as the library hands it to morph() before any data exists.
     */
    private const string MORPHED_BY = 'type';

    #[PropertyForMorph]
    public string $type;

    /**
     * @param  array<string, mixed>  $properties
     */
    public static function morph(array $properties): string
    {
        return match ($properties[self::MORPHED_BY]) {
            Everyone::TYPE => EveryoneConditionData::class,
            AllOf::TYPE, AnyOf::TYPE => ConditionGroupData::class,
            Not::TYPE => NegatedConditionData::class,
            Named::TYPE => NamedConditionData::class,
            default => KeyedConditionData::class,
        };
    }
}
