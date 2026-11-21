<?php

declare(strict_types=1);

namespace Tests\Fixtures\Reflection\Attributes;

use App\Reflection\Support\Reflector;
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
        Reflector::of(SelfReadingParcel::class)->attribute(self::class);
    }
}
