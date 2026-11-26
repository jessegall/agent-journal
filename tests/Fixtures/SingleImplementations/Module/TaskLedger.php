<?php

declare(strict_types=1);

namespace Tests\Fixtures\SingleImplementations\Module;

use Tests\Fixtures\SingleImplementations\Core\Contracts\Ledger;

/**
 * Another owner's filling of the ledger contract, named for what it keeps: no name to take from its contract.
 */
final readonly class TaskLedger implements Ledger
{
    public function balance(): int
    {
        return 0;
    }
}
