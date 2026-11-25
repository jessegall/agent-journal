<?php

declare(strict_types=1);

namespace App\Commands\Accounts\ReconcileAccounts;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

/**
 * The scheduled sweep: ends, oldest first, up to 100 live sign-ins past their deadline that a lost or late deadline
 * job left, and answers how many it ended. Run by the journal every minute (internal, not exported).
 *
 * @extends Command<int>
 */
#[Entry(CommandEntry::AccountMaintenance)]
final readonly class ReconcileAccountsCommand extends Command {}
