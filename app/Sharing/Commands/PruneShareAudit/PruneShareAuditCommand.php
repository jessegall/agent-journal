<?php

declare(strict_types=1);

namespace App\Sharing\Commands\PruneShareAudit;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Sharing\Support\AuditPruning;
use App\Support\Command;

/**
 * The sharing supervisor removes, oldest first, at most 100 audit rows past their retention (a public read after 30
 * days, a step of a share's life 365 days after it ended), counting them on their share first, and says whether more
 * wait.
 *
 * @extends Command<AuditPruning>
 */
#[Entry(CommandEntry::ShareGateway)]
final readonly class PruneShareAuditCommand extends Command {}
