<?php

declare(strict_types=1);

namespace Tests\Fixtures\Reflection;

use Tests\Fixtures\Reflection\Attributes\Marker;

/**
 * A class with two equal repeated markers, read by one test alone so it can count what is built.
 */
#[Marker('same'), Marker('same')]
final class TwiceMarkedParcel {}
