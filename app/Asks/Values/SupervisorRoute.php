<?php

declare(strict_types=1);

namespace App\Asks\Values;

use App\Values\SupervisorTarget;

final readonly class SupervisorRoute
{
    public function __construct(public SupervisorTarget $target, public int $version) {}
}
