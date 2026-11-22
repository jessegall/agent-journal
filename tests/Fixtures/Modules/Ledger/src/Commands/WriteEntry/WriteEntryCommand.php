<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Ledger\Commands\WriteEntry;

use App\Enums\AccessType;
use App\Attributes\Authorize;
use App\Support\Command;
use Tests\Fixtures\Modules\Ledger\Models\Ledger;
use Tests\Fixtures\Modules\Ledger\Policies\LedgerPolicy;

/**
 * Writes an entry in a ledger and answers its number; a refused write is refused after the entry is numbered and
 * saved, so its rollback is visible.
 *
 * @extends Command<int>
 */
#[Authorize(LedgerPolicy::class, AccessType::Create)]
final readonly class WriteEntryCommand extends Command
{
    public function __construct(public string $ledgerId, public string $text, public bool $refusedAfterSave = false) {}
}
