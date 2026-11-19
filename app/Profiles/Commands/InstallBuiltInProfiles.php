<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Profiles\Handlers\InstallBuiltInProfilesHandler;
use App\Profiles\Values\ProfileActivation;

/**
 * The journal activates its built-in profiles, with the project's proposal, the first time a launch needs one.
 *
 * @extends Command<ProfileActivation>
 */
#[HandledBy(InstallBuiltInProfilesHandler::class)]
#[Entry(CommandEntry::HostControl)]
final readonly class InstallBuiltInProfiles extends Command {}
