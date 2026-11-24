<?php

declare(strict_types=1);

namespace App\Contracts\Refusals;

use App\Contracts\Bus\CommandRefusal;
use App\Enums\ResumeRefusal;
use App\Enums\StartPreflightRefusal;
use App\Enums\StartRefusalType;
use App\Enums\StartUnavailableReason;

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
