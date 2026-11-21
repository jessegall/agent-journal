<?php

declare(strict_types=1);

namespace Tests\Fixtures\Reflection;

use Tests\Fixtures\Reflection\Attributes\Marker;

/**
 * A plain class the reflection tests reflect and extend, with a marker of its own that its subclasses do not carry.
 */
#[Marker('parcel')]
class Parcel implements Labelled
{
    use Stamped;
}
