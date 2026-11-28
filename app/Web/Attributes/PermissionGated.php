<?php

declare(strict_types=1);

namespace App\Web\Attributes;

use Attribute;

#[Attribute(Attribute::TARGET_CLASS)]
final readonly class PermissionGated
{
    public function __construct(public string $check) {}
}
