<?php

declare(strict_types=1);

namespace Tests\Fixtures\Architecture\MorphKeys;

use Spatie\LaravelData\Attributes\PropertyForMorph;
use Spatie\LaravelData\Contracts\PropertyMorphableData;
use Spatie\LaravelData\Data;

/**
 * A morphed Data whose key constant still names the property's old name, which MorphKeyConstantTest finds.
 */
abstract class StaleMorphKey extends Data implements PropertyMorphableData
{
    private const string MORPHED_BY = 'state';

    #[PropertyForMorph]
    public string $status;

    /**
     * @param  array<string, string>  $properties
     */
    public static function morph(array $properties): string
    {
        return $properties[self::MORPHED_BY];
    }
}
