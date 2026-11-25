<?php

declare(strict_types=1);

namespace Tests\Fixtures\PhpStan;

use App\Support\Reflector;
use Tests\Fixtures\Reflection\Attributes\DerivedMarker;
use Tests\Fixtures\Reflection\Attributes\Marker;
use Tests\Fixtures\Reflection\Parcel;

/**
 * Hands an attribute read as Marker to a method that wants a DerivedMarker, which PHPStan must report.
 */
final class ReflectorWrongAttributeType
{
    public function labelOf(DerivedMarker $marker): string
    {
        return $marker::class;
    }

    public function wrongType(): string
    {
        return $this->labelOf(Reflector::of(Parcel::class)->attribute(Marker::class));
    }
}
