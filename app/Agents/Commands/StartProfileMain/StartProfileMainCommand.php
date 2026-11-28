<?php

declare(strict_types=1);

namespace App\Agents\Commands\StartProfileMain;

use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\ProfileAdministrationPolicy;
use App\Sessions\StartReceipt;
use App\Support\AgentOption;
use App\Support\Command;
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
        public bool $shouldSaveDriverType = false,
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
            $target->shouldSaveDriverType,
            $target->account,
            $target->conversationId,
        );
    }

    /**
     * The start a message to a stopped agent opens: its latest conversation resumed on that conversation's driver, or
     * a new one on the profile's default, under the message's own request.
     */
    public static function onMessage(string $requestId, AgentOption $agent): self
    {
        $latest = $agent->conversations[0] ?? null;

        return new self(
            strtolower($requestId),
            $agent->agentId,
            ProfileKey::from($agent->profileKey),
            ModelSelection::fromInput('default'),
            $latest?->driver,
            conversationId: $latest?->conversationId,
        );
    }
}
