<?php

declare(strict_types=1);

namespace Tests\Fixtures\Reflection;

use Tests\Fixtures\Reflection\Attributes\SelfReadingMarker;

/**
 * A class whose marker reads itself while it is built.
 */
#[SelfReadingMarker]
final class SelfReadingParcel {}
