<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Ledger\Policies;

use App\Access\Contracts\Policy;
use Tests\Fixtures\Modules\Ledger\Models\Ledger;

/**
 * Who may run the ledgers commands: every granted actor, so the grants decide.
 */
final readonly class LedgerPolicy implements Policy
{
    public static function model(): string
    {
        return Ledger::class;
    }
}
