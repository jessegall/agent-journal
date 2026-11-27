<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands\SingletonItem;

use Illuminate\Container\Attributes\Singleton;

#[Singleton]
final class SingletonItemHandler
{
    public function handle(SingletonItemCommand $command): void {}
}
