<?php

declare(strict_types=1);

namespace App\Bus\Contracts;

use App\Bus\Values\CommandDecision;
use App\Bus\Values\EffectiveCommand;

interface CommandAdmission
{
    /**
     * Whether the command may run, as the current actor asked for it.
     */
    public function assess(EffectiveCommand $command): CommandDecision;
}
