<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands\ArrayResultItem;

use Tests\Fixtures\Bus\Shop\Commands\ArrayResultItem\ArrayResultItemCommand;

final class ArrayResultItemHandler
{
    /**
     * @return array<string, mixed>
     */
    public function handle(ArrayResultItemCommand $command): array
    {
        return [];
    }
}
