<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Garden\Handlers;

use Tests\Fixtures\Bus\Garden\Commands\Water;

final class WaterHandler
{
    public function handle(Water $command): void {}
}
