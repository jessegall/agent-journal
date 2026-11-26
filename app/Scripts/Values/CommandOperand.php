<?php

declare(strict_types=1);

namespace App\Scripts\Values;

final readonly class CommandOperand
{
    public function __construct(public string $key) {}
}
