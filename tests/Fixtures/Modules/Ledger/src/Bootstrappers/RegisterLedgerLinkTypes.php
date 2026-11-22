<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Ledger\Bootstrappers;

use App\Contracts\DomainBootstrapper;
use App\Support\DomainEntry;
use App\Support\LinkTypeRegistry;
use Tests\Fixtures\Modules\Ledger\Models\Ledger;
use Tests\Fixtures\Modules\Ledger\Models\LedgerEntry;

/**
 * Names the ledger models for links, as a domain's own service provider would.
 */
final readonly class RegisterLedgerLinkTypes implements DomainBootstrapper
{
    public function __construct(private LinkTypeRegistry $links) {}

    public function __invoke(DomainEntry $domain): void
    {
        $this->links->register([Ledger::LINK_TYPE => Ledger::class, LedgerEntry::LINK_TYPE => LedgerEntry::class]);
    }
}
