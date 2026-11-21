<?php

declare(strict_types=1);

namespace Tests\Fixtures\Reflection;

/**
 * A class whose constructor parameters carry the defaults and modifiers the parameter descriptors read.
 */
final class DefaultsParcel
{
    public const int LIMIT = 3;

    public static int $count = 0;

    public function __construct(
        public int $limit = self::LIMIT,
        public string $label = 'parcel',
        public ParcelSize $size = ParcelSize::Small,
        public int|null $weight = null,
    ) {}

    public function stamp(Parcel &$parcel, string ...$marks): void {}
}
