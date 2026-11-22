<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Values\CommandDecision;
use App\Values\EffectiveCommand;

interface CommandAdmission
{
    public function assess(EffectiveCommand $command): CommandDecision;
}
