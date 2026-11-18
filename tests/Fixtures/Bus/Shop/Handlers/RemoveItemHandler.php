<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Handlers;

use Tests\Fixtures\Bus\Shop\Commands\RemoveItem;

final class RemoveItemHandler
{
    public function handle(RemoveItem $command): void {}
}
