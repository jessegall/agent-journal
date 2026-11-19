<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Handlers;

use Tests\Fixtures\Bus\Shop\Commands\LookupItem;

final class LookupItemHandler
{
    public function handle(LookupItem $command): void {}
}
