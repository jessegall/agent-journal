<?php

declare(strict_types=1);

namespace Tests\Fixtures\Architecture\MorphKeys;

use Spatie\LaravelData\Attributes\PropertyForMorph;
use Spatie\LaravelData\Contracts\PropertyMorphableData;
use Spatie\LaravelData\Data;

/**
 * A morphed Data whose key constant names its promoted #[PropertyForMorph] property, which MorphKeyConstantTest passes.
 */
abstract class PromotedMorphKey extends Data implements PropertyMorphableData
{
    private const string MORPHED_BY = 'type';

    public function __construct(
        #[PropertyForMorph]
        public readonly string $type,
    ) {}

    /**
     * @param  array<string, string>  $properties
     */
    public static function morph(array $properties): string
    {
        return $properties[self::MORPHED_BY];
    }
}
