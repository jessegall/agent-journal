<?php

declare(strict_types=1);

namespace App\Web\Attributes;

use Attribute;

#[Attribute(Attribute::TARGET_CLASS | Attribute::TARGET_PROPERTY)]
final readonly class AppendBy
{
    public function __construct(public string $key) {}
}
