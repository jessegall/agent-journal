<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Drivers\DriverType;

/**
 * What a switch moves an agent to: the driver and driver type, the chosen account at its reviewed sign-in, the
 * conversation it resumes, if any, and whether the driver type becomes the agent's default.
 */
final readonly class DriverSwitchTarget
{
    public function __construct(
        public string $driver,
        public DriverType $driverType,
        public ChosenAccount $account,
        public string|null $conversationId,
        public bool $shouldSaveDriverType,
    ) {}
}
