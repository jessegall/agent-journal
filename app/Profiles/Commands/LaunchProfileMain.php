<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Agents\Support\LaunchReceipt;
use App\Agents\Support\ModelSelection;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Profiles\Enums\ProfileAbility;
use App\Profiles\Handlers\LaunchProfileMainHandler;
use App\Profiles\Models\Profile;
use App\Profiles\Policies\ProfileAdministrationPolicy;
use App\Profiles\Values\ProfileKey;

/**
 * A person launches a main agent from a main_agent profile, with an explicit model or the profile's default and,
 * when the profile does not pin one, a program of their choosing.
 *
 * @extends Command<LaunchReceipt>
 */
#[HandledBy(LaunchProfileMainHandler::class)]
#[Authorize(ProfileAdministrationPolicy::class, ProfileAbility::Administer)]
final readonly class LaunchProfileMain extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public string $requestId,
        public string $agentId,
        public ProfileKey $profile,
        public ModelSelection $requested,
        public string|null $programKey,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Profile::class;
    }
}
