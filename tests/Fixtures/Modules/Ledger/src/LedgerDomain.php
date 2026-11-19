<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Ledger;

use App\Actors\Contracts\ProvidesPolicies;
use App\Actors\Values\PolicyRegistration;
use App\Bus\Contracts\ProvidesCommands;
use App\Domains\Concerns\HasNumberedModels;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use App\Numbers\Contracts\ProvidesNumberedModels;
use App\Numbers\Support\NumberedModel;
use Tests\Fixtures\Modules\Ledger\Bootstrappers\RegisterLedgerLinkTypes;
use Tests\Fixtures\Modules\Ledger\Commands\OpenLedger;
use Tests\Fixtures\Modules\Ledger\Commands\WriteEntry;
use Tests\Fixtures\Modules\Ledger\Enums\LedgerAbility;
use Tests\Fixtures\Modules\Ledger\Models\Ledger;
use Tests\Fixtures\Modules\Ledger\Models\LedgerEntry;
use Tests\Fixtures\Modules\Ledger\Policies\LedgerPolicy;

/**
 * A test module of numbered records: ledgers numbered across the journal, and entries numbered within their ledger.
 */
final class LedgerDomain extends Domain implements ProvidesCommands, ProvidesNumberedModels, ProvidesPolicies
{
    use HasNumberedModels;

    public function description(): string
    {
        return 'Ledgers and their entries: numbered records for the number allocation tests.';
    }

    public function bootstrappers(): array
    {
        return [RegisterLedgerLinkTypes::class];
    }

    public function requires(): array
    {
        return [];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->build();
    }

    public function commands(): array
    {
        return [OpenLedger::class, WriteEntry::class];
    }

    public function numberedModels(): array
    {
        return [NumberedModel::global(Ledger::class), NumberedModel::within(LedgerEntry::class, Ledger::class)];
    }

    public function policies(): array
    {
        return [new PolicyRegistration(Ledger::class, LedgerPolicy::class, LedgerAbility::class)];
    }
}
