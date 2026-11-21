<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Handlers;

use Illuminate\Container\Attributes\Singleton;
use Tests\Fixtures\Bus\Shop\Commands\SingletonItem;

#[Singleton]
final class SingletonItemHandler
{
    public function handle(SingletonItem $command): void {}
}
