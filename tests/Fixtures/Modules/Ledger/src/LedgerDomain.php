<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Ledger;

use App\Access\Contracts\PolicyProvider;
use App\Access\Values\PolicyDefinition;
use App\Agents\Enums\AccessType;
use App\Bus\Contracts\CommandProvider;
use App\Support\Domain;
use App\Support\Exports;
use Tests\Fixtures\Modules\Ledger\Commands\OpenLedger\OpenLedgerCommand;
use Tests\Fixtures\Modules\Ledger\Commands\WriteEntry\WriteEntryCommand;
use Tests\Fixtures\Modules\Ledger\Models\Ledger;
use Tests\Fixtures\Modules\Ledger\Policies\LedgerPolicy;

/**
 * A test module of numbered records: ledgers numbered across the journal, and entries numbered within their ledger.
 */
final class LedgerDomain extends Domain implements CommandProvider, PolicyProvider
{
    public function description(): string
    {
        return 'Ledgers and their entries: numbered records for the number allocation tests.';
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
        return [OpenLedgerCommand::class, WriteEntryCommand::class];
    }

    public function policies(): array
    {
        return [new PolicyDefinition(LedgerPolicy::class, [AccessType::Read, AccessType::Create, AccessType::Edit, AccessType::Delete])];
    }
}
