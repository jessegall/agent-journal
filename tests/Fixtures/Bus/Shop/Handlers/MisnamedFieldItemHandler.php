<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Handlers;

use Tests\Fixtures\Bus\Shop\Commands\MisnamedFieldItem;

final class MisnamedFieldItemHandler
{
    public function handle(MisnamedFieldItem $command): void {}
}
