<?php

declare(strict_types=1);

namespace App\Contracts\Refusals;

use App\Bus\Contracts\CommandRefusal;
use App\Sessions\Enums\ResumeRefusal;
use App\Sessions\Enums\StartPreflightRefusal;
use App\Sessions\Enums\StartRefusalType;
use App\Sessions\Enums\StartUnavailableReason;

/**
 * A start refused with a stable reason code, which the start's record keeps as its receipt after the rollback.
 */
interface StartRefusal extends CommandRefusal
{
    /**
     * Why the start was refused, for a caller that tells the reasons apart.
     */
    public function reason(): StartRefusalType|StartPreflightRefusal|ResumeRefusal|StartUnavailableReason;
}
