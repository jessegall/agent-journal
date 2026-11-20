<?php

declare(strict_types=1);

namespace App\Scripts\Values;

final readonly class TextOperand
{
    public function __construct(public string $text) {}
}
