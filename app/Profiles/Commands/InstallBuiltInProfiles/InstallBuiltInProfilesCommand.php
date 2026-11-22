<?php

declare(strict_types=1);

namespace App\Profiles\Commands\InstallBuiltInProfiles;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Profiles\Values\ProfileActivation;

/**
 * The journal activates its built-in profiles, with the project's proposal, the first time a start needs one.
 *
 * @extends Command<ProfileActivation>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class InstallBuiltInProfilesCommand extends Command {}
