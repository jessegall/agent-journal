<?php

declare(strict_types=1);

namespace App\Supervision\Values;

use App\Profiles\Values\SupervisorTarget;

final readonly class SupervisorRoute
{
    public function __construct(public SupervisorTarget $target, public int $version) {}
}
