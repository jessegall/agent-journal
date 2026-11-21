<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Agents\Enums\DriverVariant;
use App\Agents\Support\StartReceipt;
use App\Agents\Values\ChosenAccount;
use App\Agents\Values\DriverSwitchTarget;
use App\Agents\Values\ModelSelection;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Profiles\Policies\ProfileAdministrationPolicy;
use App\Profiles\Values\ProfileKey;

/**
 * A user starts a main agent from a main_agent profile, with an explicit model or the profile's default and,
 * when the profile does not pin one, a driver of their choosing; optionally a variant, kept for the agent when
 * saveVariant, and an account they chose in place of the default.
 *
 * @extends Command<StartReceipt>
 */
#[Authorize(ProfileAdministrationPolicy::class, AccessType::Create)]
final readonly class StartProfileMain extends Command
{
    public function __construct(
        public string $requestId,
        public string $agentId,
        public ProfileKey $profile,
        public ModelSelection $requested,
        public string|null $driverKey,
        public DriverVariant|null $variant = null,
        public bool $saveVariant = false,
        public ChosenAccount|null $chosenAccount = null,
        public string|null $conversationId = null,
    ) {}

    /**
     * The start that moves an agent to a switch's target, under the switch's own request.
     */
    public static function toTarget(
        string $requestId,
        string $agentId,
        ProfileKey $profile,
        DriverSwitchTarget $target,
    ): self {
        return new self(
            $requestId,
            $agentId,
            $profile,
            ModelSelection::fromInput('default'),
            $target->driver->value,
            $target->variant,
            $target->saveVariant,
            $target->account,
            $target->conversationId,
        );
    }
}
