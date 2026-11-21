<?php

declare(strict_types=1);

namespace Tests\Fixtures\Reflection\Attributes;

use Attribute;
use LogicException;
use RuntimeException;

/**
 * An attribute whose constructor always throws.
 */
#[Attribute(Attribute::TARGET_CLASS)]
final class FailingMarker
{
    public function __construct()
    {
        throw new RuntimeException('The marker refuses to be built.', previous: new LogicException('the cause'));
    }
}
