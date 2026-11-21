<?php

declare(strict_types=1);

namespace Tests\Fixtures\Reflection\Attributes;

use Attribute;

/**
 * An attribute for methods, properties and parameters, named by its label.
 */
#[Attribute(Attribute::TARGET_METHOD | Attribute::TARGET_PROPERTY | Attribute::TARGET_PARAMETER)]
final readonly class MemberMarker
{
    public function __construct(public string $label) {}
}
