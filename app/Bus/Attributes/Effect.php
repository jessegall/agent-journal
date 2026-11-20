<?php

declare(strict_types=1);

namespace App\Bus\Attributes;

use App\Bus\Enums\CommandEffectType;
use Attribute;

#[Attribute(Attribute::TARGET_CLASS)]
final readonly class Effect
{
    public function __construct(public CommandEffectType $type) {}
}
