<?php

declare(strict_types=1);

namespace App\Values;

final readonly class TextOperand
{
    public function __construct(public string $text) {}

    public function label(): string
    {
        return '"'.$this->text.'"';
    }
}
