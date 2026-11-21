<?php

declare(strict_types=1);

namespace Tests\Fixtures\Reflection\Attributes;

use Attribute;

/**
 * An attribute that extends BaseMarker.
 */
#[Attribute(Attribute::TARGET_CLASS)]
final class DerivedMarker extends BaseMarker {}
