<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Handlers;

use Tests\Fixtures\Bus\Shop\Commands\ArrayResultItem;

final class ArrayResultHandler
{
    /**
     * @return array<string, mixed>
     */
    public function handle(ArrayResultItem $command): array
    {
        return [];
    }
}
