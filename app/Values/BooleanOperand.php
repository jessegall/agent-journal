<?php

declare(strict_types=1);

namespace App\Values;

final readonly class BooleanOperand
{
    public function __construct(public string $object, public string $member, public bool $isNegated) {}

    public function label(): string
    {
        return ($this->isNegated ? 'NOT ' : '')."{$this->object}.{$this->member}";
    }
}
