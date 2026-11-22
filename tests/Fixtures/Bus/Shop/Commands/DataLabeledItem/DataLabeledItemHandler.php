<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands\DataLabeledItem;

final class DataLabeledItemHandler
{
    public function handle(DataLabeledItemCommand $command): int
    {
        return strlen($command->label->text);
    }
}
