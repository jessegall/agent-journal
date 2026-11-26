<?php

declare(strict_types=1);

namespace Tests\Fixtures\Listeners;

use App\Attributes\Listeners\InCommandTransaction;
use App\Navigation\Contracts\ClientUpdate;

/**
 * A Core listener the command's transaction requires.
 */
#[InCommandTransaction]
final class TransactionProgressListener
{
    public function handle(ClientUpdate $event): void {}
}
