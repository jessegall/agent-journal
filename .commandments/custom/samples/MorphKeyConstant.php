<?php

declare(strict_types=1);

namespace App\Samples;

use Spatie\LaravelData\Attributes\PropertyForMorph;
use Spatie\LaravelData\Contracts\PropertyMorphableData;
use Spatie\LaravelData\Data;

/**
 * A morphed Data whose morph reads its properties by a written key, which the morph-key-constant rule finds.
 */
abstract class SampleShelfData extends Data implements PropertyMorphableData
{
    #[PropertyForMorph]
    public string $type;

    /**
     * @param  array<string, string>  $properties
     */
    public static function morph(array $properties): string
    {
        // @sin MorphKeyConstantDetector
        return $properties['type'];
    }
}

/**
 * A morphed Data whose morph reads its properties through the constant beside the property, which the rule passes.
 */
abstract class SampleCrateData extends Data implements PropertyMorphableData
{
    private const string MORPHED_BY = 'type';

    #[PropertyForMorph]
    public string $type;

    /**
     * @param  array<string, string>  $properties
     */
    public static function morph(array $properties): string
    {
        // @righteous MorphKeyConstantDetector
        return $properties[self::MORPHED_BY];
    }
}

/**
 * A static method of another name reading an array by a written key, which is no morph and passes.
 */
final class SampleLabels
{
    /**
     * @param  array<string, string>  $labels
     */
    public static function shelf(array $labels): string
    {
        // @righteous MorphKeyConstantDetector
        return $labels['shelf'];
    }
}
