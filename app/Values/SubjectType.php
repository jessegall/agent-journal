<?php

declare(strict_types=1);

namespace App\Values;

final readonly class SubjectType
{
    public function __construct(public string $key, public bool $isWorkRequired = true) {}
}
