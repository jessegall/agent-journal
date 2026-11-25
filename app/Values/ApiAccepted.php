<?php

declare(strict_types=1);

namespace App\Values;

use Spatie\LaravelData\Data;

/**
 * The answer of a call that has nothing to tell but that the journal took it.
 */
final class ApiAccepted extends Data
{
    public function __construct(public readonly bool $isAccepted = true) {}
}
