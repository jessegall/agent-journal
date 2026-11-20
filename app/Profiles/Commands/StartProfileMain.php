<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Agents\Support\ModelSelection;
use App\Agents\Support\StartReceipt;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Profiles\Handlers\StartProfileMainHandler;
use App\Profiles\Policies\ProfileAdministrationPolicy;
use App\Profiles\Values\ProfileKey;

/**
 * A user starts a main agent from a main_agent profile, with an explicit model or the profile's default and,
 * when the profile does not pin one, a program of their choosing.
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
        public string|null $programKey,
    ) {}
}
