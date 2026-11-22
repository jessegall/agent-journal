<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands\PartsItem;

final class PartsItemHandler
{
    public function handle(PartsItemCommand $command): int
    {
        return count($command->parts);
    }
}
