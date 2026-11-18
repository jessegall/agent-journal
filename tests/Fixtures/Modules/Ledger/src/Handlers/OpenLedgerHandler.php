<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Ledger\Handlers;

use Tests\Fixtures\Modules\Ledger\Commands\OpenLedger;
use Tests\Fixtures\Modules\Ledger\Models\Ledger;

final readonly class OpenLedgerHandler
{
    public function handle(OpenLedger $command): string
    {
        return Ledger::query()->create(['title' => $command->title])->id;
    }
}
