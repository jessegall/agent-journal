<?php

declare(strict_types=1);

namespace App\Support\Stack\Contracts;

use App\Enums\CommandEffectType;
use App\Values\StackTarget;
use App\Values\StackVerdict;

interface StackPermission
{
    /**
     * Whether the target's stack lets work with the effect go ahead, and which state decides.
     */
    public function allows(StackTarget $target, CommandEffectType $effect): StackVerdict;
}
