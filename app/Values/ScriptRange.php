<?php

declare(strict_types=1);

namespace App\Values;

final readonly class ScriptRange
{
    public function __construct(public int $line, public int $column, public int $length) {}
}
