<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Ledger\Commands\WriteEntry;

use App\Bus\Contracts\CommandHandler;
use App\Bus\Exceptions\CommandRefused;
use Tests\Fixtures\Modules\Ledger\Models\LedgerEntry;

final readonly class WriteEntryHandler implements CommandHandler
{
    public function handle(WriteEntryCommand $command): int
    {
        $entry = LedgerEntry::write($command->ledgerId, $command->text);

        if ($command->isRefusedAfterSave) {
            throw CommandRefused::because('the entry was refused after it was numbered');
        }

        return $entry->number;
    }
}
