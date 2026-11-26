<?php

declare(strict_types=1);

namespace Tests\Fixtures\SingleImplementations\Core\Contracts;

/**
 * A contract its owner declares for other owners to fill, filled so far by one class of another owner.
 */
interface Ledger
{
    public function balance(): int;
}
