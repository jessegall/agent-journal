<?php

declare(strict_types=1);

namespace App\Hooks\Stack\Contracts;

use App\Agents\Values\StackTarget;
use App\Bus\Enums\CommandEffectType;
use App\Hooks\Stack\StackVerdict;

interface StackPermission
{
    public function allows(StackTarget $target, CommandEffectType $effect): StackVerdict;
}
