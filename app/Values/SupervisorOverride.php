<?php

declare(strict_types=1);

namespace App\Values;

final readonly class SupervisorOverride
{
    public function __construct(public AskTypeKey $type, public SupervisorTarget $target) {}
}
