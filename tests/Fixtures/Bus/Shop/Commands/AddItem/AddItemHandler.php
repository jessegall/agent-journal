<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands\AddItem;

use Tests\Fixtures\Bus\Shop\Commands\AddItem\AddItemCommand;

final class AddItemHandler
{
    public function handle(AddItemCommand $command): int
    {
        return $command->itemId;
    }
}
