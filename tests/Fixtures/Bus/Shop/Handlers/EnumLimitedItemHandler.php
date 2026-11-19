<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Handlers;

use Tests\Fixtures\Bus\Shop\Commands\EnumLimitedItem;

final class EnumLimitedItemHandler
{
    public function handle(EnumLimitedItem $command): void {}
}
