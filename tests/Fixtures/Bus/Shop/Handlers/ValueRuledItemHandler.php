<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Handlers;

use Tests\Fixtures\Bus\Shop\Commands\ValueRuledItem;

final class ValueRuledItemHandler
{
    public function handle(ValueRuledItem $command): void {}
}
