<?php

declare(strict_types=1);

namespace App\Values;

use Spatie\LaravelData\Data;

/**
 * The answer of one sent call, and whether it is printed on one line.
 */
final readonly class CallAnswer
{
    public function __construct(public Data $answer, public bool $isOneLine) {}
}
