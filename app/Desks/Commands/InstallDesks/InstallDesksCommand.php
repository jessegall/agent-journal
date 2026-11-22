<?php

declare(strict_types=1);

namespace App\Desks\Commands\InstallDesks;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * Creates Core's built-in desks once; running it again changes nothing.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class InstallDesksCommand extends Command {}
