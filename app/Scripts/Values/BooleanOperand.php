<?php

declare(strict_types=1);

namespace App\Scripts\Values;

final readonly class BooleanOperand
{
    public function __construct(public string $object, public string $member, public bool $isNegated) {}
}
