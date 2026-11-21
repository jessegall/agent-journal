<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Agents\Enums\DriverVariant;
use App\Agents\Support\StartReceipt;
use App\Agents\Values\ChosenAccount;
use App\Agents\Values\ModelSelection;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Profiles\Handlers\StartProfileMainHandler;
use App\Profiles\Policies\ProfileAdministrationPolicy;
use App\Profiles\Values\ProfileKey;

/**
 * A user starts a main agent from a main_agent profile, with an explicit model or the profile's default and,
 * when the profile does not pin one, a driver of their choosing; optionally a variant, kept for the agent when
 * saveVariant, and an account they chose in place of the default.
 *
 * @extends Command<StartReceipt>
 */
#[HandledBy(StartProfileMainHandler::class)]
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
    ) {}
}
