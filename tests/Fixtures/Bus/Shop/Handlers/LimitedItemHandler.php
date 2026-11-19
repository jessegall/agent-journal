<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Handlers;

use Tests\Fixtures\Bus\Shop\Commands\LimitedItem;

final class LimitedItemHandler
{
    public function handle(LimitedItem $command): void {}
}
