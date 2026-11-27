<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands\AddItem;

final class AddItemHandler
{
    public function handle(AddItemCommand $command): int
    {
        return $command->itemId;
    }
}
