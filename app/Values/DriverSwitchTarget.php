<?php

declare(strict_types=1);

namespace App\Values;

use App\Agents\Drivers\Enums\DriverType;

/**
 * What a switch moves an agent to: the driver and driver type, the chosen account at its reviewed sign-in, the
 * conversation it resumes, if any, whether the driver type becomes the agent's default, the model (a name or default)
 * and, for another driver, whether the new session first reads the conversation it carries over.
 */
final readonly class DriverSwitchTarget
{
    public function __construct(
        public string $driver,
        public DriverType $driverType,
        public ChosenAccount $account,
        public string|null $conversationId,
        public bool $shouldSaveDriverType,
        public string $model = 'default',
        public bool $carriesConversation = false,
    ) {}
}
