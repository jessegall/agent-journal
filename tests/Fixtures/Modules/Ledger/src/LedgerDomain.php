<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Ledger;

use Tests\Fixtures\Modules\Ledger\Bootstrappers\RegisterLedgerLinkTypes;
use App\Domains\Bootstrappers\RegisterNumberedModels;
use App\Domains\Contracts\ProvidesBootstrappers;
use App\Bus\Contracts\ProvidesCommands;
use App\Domains\Contracts\Domain;
use App\Numbers\Contracts\ProvidesNumberedModels;
use App\Numbers\Support\NumberedModel;
use Tests\Fixtures\Modules\Ledger\Commands\OpenLedger;
use Tests\Fixtures\Modules\Ledger\Commands\WriteEntry;
use Tests\Fixtures\Modules\Ledger\Models\Ledger;
use Tests\Fixtures\Modules\Ledger\Models\LedgerEntry;

/**
 * A test module of numbered records: ledgers numbered across the journal, and entries numbered within their ledger.
 */
final class LedgerDomain implements Domain, ProvidesCommands, ProvidesNumberedModels, ProvidesBootstrappers
{
    public function description(): string
    {
        return 'Ledgers and their entries: numbered records for the number allocation tests.';
    }

    public function requires(): array
    {
        return [];
    }

    /**
     * @return list<class-string>
     */
    public function exports(): array
    {
        return [];
    }

    public function commands(): array
    {
        return [OpenLedger::class, WriteEntry::class];
    }

    public function numberedModels(): array
    {
        return [NumberedModel::global(Ledger::class), NumberedModel::within(LedgerEntry::class, Ledger::class)];
    }

    public function bootstrappers(): array
    {
        return [RegisterNumberedModels::class, RegisterLedgerLinkTypes::class];
    }
}
