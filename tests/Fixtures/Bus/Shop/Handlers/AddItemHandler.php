<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Handlers;

use Tests\Fixtures\Bus\Shop\Commands\AddItem;

final class AddItemHandler
{
    public function handle(AddItem $command): int
    {
        return $command->itemId;
    }
}
