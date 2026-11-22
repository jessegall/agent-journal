<?php

declare(strict_types=1);

namespace App\Values;

use App\Contracts\FactOrigin;

/**
 * A fact the shell syntax gives by itself, such as a > redirect writing its target.
 */
final readonly class SyntaxOrigin implements FactOrigin
{
    public function __construct(public string $construct) {}

    public function reference(): string
    {
        return "syntax:{$this->construct}";
    }
}
