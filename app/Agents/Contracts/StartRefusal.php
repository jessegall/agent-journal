<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Agents\Enums\ResumeRefusal;
use App\Agents\Enums\StartPreflightRefusal;
use App\Agents\Enums\StartRefusalType;
use App\Agents\Enums\StartUnavailableReason;
use App\Contracts\CommandRefusal;

/**
 * A start refused with a stable reason code, which the start's record keeps as its receipt after the rollback.
 */
interface StartRefusal extends CommandRefusal
{
    public function reason(): StartRefusalType|StartPreflightRefusal|ResumeRefusal|StartUnavailableReason;
}
