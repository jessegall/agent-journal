<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands\SingletonItem;

use Illuminate\Container\Attributes\Singleton;
use Tests\Fixtures\Bus\Shop\Commands\SingletonItem\SingletonItemCommand;

#[Singleton]
final class SingletonItemHandler
{
    public function handle(SingletonItemCommand $command): void {}
}
