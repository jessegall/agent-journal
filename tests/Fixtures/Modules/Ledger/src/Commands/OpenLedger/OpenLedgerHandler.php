<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Ledger\Commands\OpenLedger;

use App\Bus\Contracts\CommandHandler;
use Tests\Fixtures\Modules\Ledger\Models\Ledger;

final readonly class OpenLedgerHandler implements CommandHandler
{
    public function handle(OpenLedgerCommand $command): string
    {
        return Ledger::open($command->title)->getKey();
    }
}
