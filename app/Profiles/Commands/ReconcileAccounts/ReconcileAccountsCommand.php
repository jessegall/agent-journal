<?php

declare(strict_types=1);

namespace App\Profiles\Commands\ReconcileAccounts;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * The scheduled sweep: ends, oldest first, up to 100 live sign-ins past their deadline that a lost or late deadline
 * job left, and answers how many it ended. Run by the journal every minute (internal, not exported).
 *
 * @extends Command<int>
 */
#[Entry(CommandEntry::AccountMaintenance)]
final readonly class ReconcileAccountsCommand extends Command {}
