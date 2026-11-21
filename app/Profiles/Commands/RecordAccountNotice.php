<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Profiles\Enums\AccountNoticeReason;
use App\Profiles\Handlers\RecordAccountNoticeHandler;

/**
 * A refused start or a failure the owner can act on becomes a notice on the program's accounts, counted again while
 * one of its reason is open. Run by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::AccountMaintenance)]
#[HandledBy(RecordAccountNoticeHandler::class)]
final readonly class RecordAccountNotice extends Command
{
    public function __construct(
        public string $driver,
        public AccountNoticeReason $reason,
    ) {}
}
