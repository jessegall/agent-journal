<?php

declare(strict_types=1);

namespace App\Commands\Profiles\InstallBuiltInProfiles;

use App\Attributes\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;
use App\Values\ProfileActivation;

/**
 * The journal activates its built-in profiles, with the project's proposal, the first time a start needs one.
 *
 * @extends Command<ProfileActivation>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class InstallBuiltInProfilesCommand extends Command {}
