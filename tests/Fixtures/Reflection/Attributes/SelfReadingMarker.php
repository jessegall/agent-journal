<?php

declare(strict_types=1);

namespace Tests\Fixtures\Reflection\Attributes;

use App\Support\ReflectedType;
use Attribute;
use Tests\Fixtures\Reflection\SelfReadingParcel;

/**
 * An attribute whose constructor reads itself from the class it marks.
 */
#[Attribute(Attribute::TARGET_CLASS)]
final class SelfReadingMarker
{
    public function __construct()
    {
        ReflectedType::of(SelfReadingParcel::class)->attribute(self::class);
    }
}
