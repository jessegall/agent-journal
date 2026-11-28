<?php

declare(strict_types=1);

namespace App\Web\Attributes;

use Attribute;

#[Attribute(Attribute::TARGET_PROPERTY)]
final readonly class Bounded
{
    public function __construct(public int $limit) {}
}
