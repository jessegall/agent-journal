<?php

declare(strict_types=1);

namespace App\Web\Attributes;

use Attribute;

#[Attribute(Attribute::TARGET_CLASS)]
final readonly class RecordScoped
{
    public function __construct(public string $parameter) {}
}
