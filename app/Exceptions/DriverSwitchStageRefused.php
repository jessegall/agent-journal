<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Enums\Drivers\DriverSwitchStage;
use LogicException;

/**
 * A switch asked to move to a stage that may not follow the one it stands at.
 */
final class DriverSwitchStageRefused extends LogicException
{
    public static function from(DriverSwitchStage $stage, DriverSwitchStage $next): self
    {
        return new self("A switch at {$stage->value} cannot move to {$next->value}.");
    }
}
