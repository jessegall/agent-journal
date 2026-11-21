<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Handlers;

use Tests\Fixtures\Bus\Shop\Commands\UnbuildableLookupItem;

final class UnbuildableLookupItemHandler
{
    public function handle(UnbuildableLookupItem $command): void {}
}
