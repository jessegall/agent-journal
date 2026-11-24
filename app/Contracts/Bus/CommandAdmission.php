<?php

declare(strict_types=1);

namespace App\Contracts\Bus;

use App\Values\CommandDecision;
use App\Values\EffectiveCommand;

interface CommandAdmission
{
    /**
     * Whether the command may run, as the current actor asked for it.
     */
    public function assess(EffectiveCommand $command): CommandDecision;
}
