<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Profiles\Handlers\ReconcileAccountsHandler;

/**
 * The scheduled sweep: ends, oldest first, up to 100 live sign-ins past their deadline that a lost or late deadline
 * job left, and answers how many it ended. Run by the journal every minute (internal, not exported).
 *
 * @extends Command<int>
 */
#[HandledBy(ReconcileAccountsHandler::class)]
#[Entry(CommandEntry::AccountMaintenance)]
final readonly class ReconcileAccounts extends Command {}
