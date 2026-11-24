<?php

declare(strict_types=1);

namespace App\Commands\StartProfileMain;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Enums\DriverType;
use App\Policies\ProfileAdministrationPolicy;
use App\Support\Command;
use App\Support\StartReceipt;
use App\Values\ChosenAccount;
use App\Values\DriverSwitchTarget;
use App\Values\ModelSelection;
use App\Values\ProfileKey;

/**
 * A user starts a main agent from a main_agent profile, with an explicit model or the profile's default and,
 * when the profile does not pin one, a driver of their choosing; optionally a driver type, kept for the agent when
 * saveDriverType, and an account they chose in place of the default.
 *
 * @extends Command<StartReceipt>
 */
#[Authorize(ProfileAdministrationPolicy::class, AccessType::Create)]
final readonly class StartProfileMainCommand extends Command
{
    public function __construct(
        public string $requestId,
        public string $agentId,
        public ProfileKey $profile,
        public ModelSelection $requested,
        public string|null $driverKey,
        public DriverType|null $driverType = null,
        public bool $saveDriverType = false,
        public ChosenAccount|null $chosenAccount = null,
        public string|null $conversationId = null,
        public int|null $previewRevision = null,
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
            $target->driver,
            $target->driverType,
            $target->saveDriverType,
            $target->account,
            $target->conversationId,
        );
    }
}
