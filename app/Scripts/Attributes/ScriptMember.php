<?php

declare(strict_types=1);

namespace App\Scripts\Attributes;

use Attribute;

#[Attribute(Attribute::TARGET_PROPERTY)]
final readonly class ScriptMember
{
    public function __construct(public string $read) {}
}
