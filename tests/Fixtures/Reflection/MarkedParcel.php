<?php

declare(strict_types=1);

namespace Tests\Fixtures\Reflection;

use Tests\Fixtures\Reflection\Attributes\DerivedMarker;
use Tests\Fixtures\Reflection\Attributes\Marker;

/**
 * A class with two repeated markers and one derived marker.
 */
#[Marker('first'), DerivedMarker, Marker('second')]
final class MarkedParcel extends Parcel {}
