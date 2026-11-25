<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Drivers\DriverSwitchStage;
use App\Models\Drivers\DriverSwitch;

/**
 * Where a switch stands, as its requester is told: the switch, its stage and why it was refused, if it was.
 */
final readonly class DriverSwitchReceipt
{
    public function __construct(
        public string $switchId,
        public DriverSwitchStage $stage,
        public string|null $failureReason,
    ) {}

    public static function of(DriverSwitch $switch): self
    {
        return new self($switch->id, $switch->stage, $switch->failure_reason);
    }
}
