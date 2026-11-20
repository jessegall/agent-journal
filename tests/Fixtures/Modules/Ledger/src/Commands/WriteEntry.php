<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Ledger\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use Tests\Fixtures\Modules\Ledger\Enums\LedgerAbility;
use Tests\Fixtures\Modules\Ledger\Handlers\WriteEntryHandler;
use Tests\Fixtures\Modules\Ledger\Models\Ledger;
use Tests\Fixtures\Modules\Ledger\Policies\LedgerPolicy;

/**
 * Writes an entry in a ledger and answers its number; a refused write is refused after the entry is numbered and
 * saved, so its rollback is visible.
 *
 * @extends Command<int>
 */
#[HandledBy(WriteEntryHandler::class)]
#[Authorize(LedgerPolicy::class, LedgerAbility::Work)]
#[Operation('write_entry', ResourceAreaType::JournalWork, AccessType::Create)]
final readonly class WriteEntry extends Command implements AuthorizedCommand
{
    public function __construct(public string $ledgerId, public string $text, public bool $refusedAfterSave = false) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Ledger::class;
    }
}
