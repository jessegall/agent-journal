<?php

declare(strict_types=1);

namespace App\Data\Skills\Conditions;

use App\Support\Conditions\AllOf;
use App\Support\Conditions\AnyOf;
use App\Support\Conditions\Everyone;
use App\Support\Conditions\Named;
use App\Support\Conditions\Not;
use Spatie\LaravelData\Attributes\PropertyForMorph;
use Spatie\LaravelData\Contracts\PropertyMorphableData;
use Spatie\LaravelData\Data;

/**
 * A skill condition as a revision stores it, in the wire format ConditionTree reads: each node chosen by its type.
 * ConditionTree validates it and turns it into the condition that is evaluated.
 */
abstract class StoredConditionData extends Data implements PropertyMorphableData
{
    #[PropertyForMorph]
    public string $type;

    /**
     * @param  array<string, mixed>  $properties
     */
    public static function morph(array $properties): string
    {
        return match ($properties['type']) {
            Everyone::TYPE => EveryoneConditionData::class,
            AllOf::TYPE, AnyOf::TYPE => ConditionGroupData::class,
            Not::TYPE => NegatedConditionData::class,
            Named::TYPE => NamedConditionData::class,
            default => KeyedConditionData::class,
        };
    }
}
