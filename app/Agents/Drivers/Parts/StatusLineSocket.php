<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Parts;

use App\Agents\Drivers\ClaudeCode\StatusLineLimits;
use App\Agents\Drivers\Contracts\PlanPart;
use App\Values\DriverStart;
use App\Values\PlanAddition;

/**
 * The side socket an account terminal hands its status line to, which the journal reads the limit windows from.
 */
final readonly class StatusLineSocket implements PlanPart
{
    /**
     * The status line's side socket.
     */
    public function __invoke(DriverStart $start): PlanAddition
    {
        return new PlanAddition(sideSockets: [StatusLineLimits::SOCKET]);
    }
}
