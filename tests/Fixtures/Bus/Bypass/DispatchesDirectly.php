<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Bypass;

use Illuminate\Support\Facades\Bus;

final class DispatchesDirectly
{
    public function run(object $command): mixed
    {
        // A sample the bypass rule names: a command sent around the CommandBus.
        return Bus::dispatchSync($command);
    }
}
