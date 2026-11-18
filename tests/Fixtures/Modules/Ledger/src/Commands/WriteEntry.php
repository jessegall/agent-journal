<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Ledger\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Tests\Fixtures\Modules\Ledger\Handlers\WriteEntryHandler;

/**
 * Writes an entry in a ledger and answers its number; a refused write is refused after the entry is numbered and
 * saved, so its rollback is visible.
 *
 * @implements Command<int>
 */
#[HandledBy(WriteEntryHandler::class)]
final readonly class WriteEntry implements Command
{
    public function __construct(public string $ledgerId, public string $text, public bool $refusedAfterSave = false) {}
}
