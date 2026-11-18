<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Bypass;

use Illuminate\Database\ConnectionInterface;

final class OpensTransaction
{
    public function run(ConnectionInterface $database): mixed
    {
        // A sample the transaction rule names: a transaction opened outside the bus.
        return $database->transaction(fn () => true);
    }
}
