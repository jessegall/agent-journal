<?php

declare(strict_types=1);

namespace App\Commands\Hosts\MarkSilentHosts;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

/**
 * Marks failing every host whose heartbeat has been silent for 90 seconds, so the user is shown it. Run by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class MarkSilentHostsCommand extends Command {}
