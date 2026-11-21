<?php

declare(strict_types=1);

namespace Tests\Fixtures\Reflection\Attributes;

use Attribute;

/**
 * An attribute another attribute extends.
 */
#[Attribute(Attribute::TARGET_CLASS)]
class BaseMarker implements Describes {}
