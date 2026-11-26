<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Access\Contracts\Events\FactOrigin;

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
