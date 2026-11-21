<?php

declare(strict_types=1);

namespace Tests\Fixtures\Reflection\Attributes;

use Attribute;

/**
 * An attribute for enum cases, named by its label.
 */
#[Attribute(Attribute::TARGET_CLASS_CONSTANT)]
final readonly class CaseMarker
{
    public function __construct(public string $label) {}
}
