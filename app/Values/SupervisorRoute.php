<?php

declare(strict_types=1);

namespace App\Values;

final readonly class SupervisorRoute
{
    public function __construct(public SupervisorTarget $target, public int $version) {}
}
