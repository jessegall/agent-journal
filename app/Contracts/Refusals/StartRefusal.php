<?php

declare(strict_types=1);

namespace App\Contracts\Refusals;

use App\Contracts\Bus\CommandRefusal;
use App\Enums\Sessions\ResumeRefusal;
use App\Enums\Sessions\StartPreflightRefusal;
use App\Enums\Sessions\StartRefusalType;
use App\Enums\Sessions\StartUnavailableReason;

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
