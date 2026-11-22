<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\DriverVariant;

/**
 * What a switch moves an agent to: the driver and variant, the chosen account at its reviewed sign-in, the
 * conversation it resumes, if any, and whether the variant becomes the agent's default.
 */
final readonly class DriverSwitchTarget
{
    public function __construct(
        public string $driver,
        public DriverVariant $variant,
        public ChosenAccount $account,
        public string|null $conversationId,
        public bool $saveVariant,
    ) {}
}
