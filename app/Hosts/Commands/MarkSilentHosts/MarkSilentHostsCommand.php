<?php

declare(strict_types=1);

namespace App\Hosts\Commands\MarkSilentHosts;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Marks failing every host whose heartbeat has been silent for 90 seconds, so the user is shown it. Run by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class MarkSilentHostsCommand extends Command {}
