<?php

declare(strict_types=1);

namespace App\Inboxes\Commands\InstallInboxes;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Installs the inboxes Core needs, once; a second run changes nothing.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class InstallInboxesCommand extends Command {}
