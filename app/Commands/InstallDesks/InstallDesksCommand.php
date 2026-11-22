<?php

declare(strict_types=1);

namespace App\Commands\InstallDesks;

use App\Attributes\Entry;
use App\Enums\CommandEntry;
use App\Support\Command;

/**
 * Creates Core's built-in desks once; running it again changes nothing.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class InstallDesksCommand extends Command {}
