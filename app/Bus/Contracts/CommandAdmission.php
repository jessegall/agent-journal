<?php

declare(strict_types=1);

namespace App\Bus\Contracts;

use App\Bus\Values\CommandDecision;
use App\Bus\Values\EffectiveCommand;

interface CommandAdmission
{
    public function assess(EffectiveCommand $command): CommandDecision;
}
