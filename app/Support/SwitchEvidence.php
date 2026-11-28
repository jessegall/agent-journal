<?php

declare(strict_types=1);

namespace App\Support;

use App\Agents\Drivers\Enums\DriverSwitchStage;
use App\Models\Drivers\DriverSwitch;

/**
 * An agent's latest switch as its status reads it: its id, its stage and the process generation it expects, which a
 * recovery names as its version.
 */
final readonly class SwitchEvidence
{
    public function __construct(
        public string $id,
        public DriverSwitchStage $stage,
        public int $version,
    ) {}

    public static function of(DriverSwitch $switch): self
    {
        return new self($switch->id, $switch->stage, $switch->expected_generation);
    }

    /**
     * Whether the switch still decides the agent's status: under way, or its start failed and it may be retried.
     */
    public function isUnderWay(): bool
    {
        return ! $this->stage->isFinal() || $this->stage === DriverSwitchStage::StartFailed;
    }

    public function operation(): StatusFollowedOperation
    {
        return new StatusFollowedOperation($this->id, 'switch', $this->stage->value, $this->version);
    }
}
