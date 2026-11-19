<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Ledger\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use Tests\Fixtures\Modules\Ledger\Enums\LedgerAbility;
use Tests\Fixtures\Modules\Ledger\Handlers\WriteEntryHandler;
use Tests\Fixtures\Modules\Ledger\Models\Ledger;
use Tests\Fixtures\Modules\Ledger\Policies\LedgerPolicy;

/**
 * Writes an entry in a ledger and answers its number; a refused write is refused after the entry is numbered and
 * saved, so its rollback is visible.
 *
 * @implements Command<int>
 */
#[HandledBy(WriteEntryHandler::class)]
#[Authorize(LedgerPolicy::class, LedgerAbility::Work)]
final readonly class WriteEntry implements Command, HasAuthorizationSubject
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
