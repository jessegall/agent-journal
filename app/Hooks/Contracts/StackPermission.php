<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Agents\Support\StackTarget;
use App\Bus\Enums\CommandEffectType;
use App\Hooks\Stack\StackVerdict;

interface StackPermission
{
    public function allows(StackTarget $target, CommandEffectType $effect): StackVerdict;
}
