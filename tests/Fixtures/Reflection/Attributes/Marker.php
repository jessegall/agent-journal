<?php

declare(strict_types=1);

namespace Tests\Fixtures\Reflection\Attributes;

use Attribute;

/**
 * A repeatable attribute that counts how often it is built.
 */
#[Attribute(Attribute::TARGET_CLASS | Attribute::IS_REPEATABLE)]
final class Marker
{
    public static int $built = 0;

    public function __construct(public readonly string $label)
    {
        self::$built++;
    }
}
