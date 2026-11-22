<?php

declare(strict_types=1);

namespace App\Attributes;

use App\Enums\PlaceExemption;
use Attribute;

/**
 * Marks a method that touches files outside the funnel's places for a reason the user settled; the architecture test
 * lists its sites apart, by that reason, instead of waiting for them to move.
 */
#[Attribute(Attribute::TARGET_METHOD)]
final readonly class OutsideThePlaces
{
    public function __construct(public PlaceExemption $exemption) {}
}
