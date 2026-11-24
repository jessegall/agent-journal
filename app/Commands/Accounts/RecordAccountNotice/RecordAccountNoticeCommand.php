<?php

declare(strict_types=1);

namespace App\Commands\Accounts\RecordAccountNotice;

use App\Attributes\Entry;
use App\Enums\AccountNoticeReason;
use App\Enums\CommandEntry;
use App\Support\Command;

/**
 * A refused start or a failure the owner can act on becomes a notice on the driver's accounts, counted again while
 * one of its reason is open. Run by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::AccountMaintenance)]
final readonly class RecordAccountNoticeCommand extends Command
{
    public function __construct(
        public string $driver,
        public AccountNoticeReason $reason,
    ) {}
}
