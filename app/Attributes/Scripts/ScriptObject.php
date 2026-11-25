<?php

declare(strict_types=1);

namespace App\Attributes\Scripts;

use Attribute;

#[Attribute(Attribute::TARGET_CLASS)]
final readonly class ScriptObject
{
    public function __construct(public string $key) {}
}
