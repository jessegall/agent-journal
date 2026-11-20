<?php

declare(strict_types=1);

namespace App\Sharing\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Sharing\Handlers\PruneShareAuditHandler;
use App\Sharing\Support\AuditPruning;

/**
 * The sharing supervisor removes, oldest first, at most 100 audit rows past their retention (a public read after 30
 * days, a step of a share's life 365 days after it ended), counting them on their share first, and says whether more
 * wait.
 *
 * @extends Command<AuditPruning>
 */
#[Entry(CommandEntry::ShareGateway)]
#[HandledBy(PruneShareAuditHandler::class)]
final readonly class PruneShareAudit extends Command {}
