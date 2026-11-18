<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Ledger\Handlers;

use App\Bus\Exceptions\CommandRefused;
use App\Contracts\CommandHandler;
use Tests\Fixtures\Modules\Ledger\Commands\WriteEntry;
use Tests\Fixtures\Modules\Ledger\Models\LedgerEntry;

final readonly class WriteEntryHandler implements CommandHandler
{
    public function handle(WriteEntry $command): int
    {
        $entry = LedgerEntry::query()->create(['ledger_id' => $command->ledgerId, 'text' => $command->text]);

        if ($command->refusedAfterSave) {
            throw CommandRefused::because('the entry was refused after it was numbered');
        }

        return $entry->number;
    }
}
