<?php

declare(strict_types=1);

namespace App\Values;

use Spatie\LaravelData\Data;

final class SupervisorOverride extends Data
{
    public function __construct(public readonly AskTypeKey $type, public readonly SupervisorTarget $target) {}
}
