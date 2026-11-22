<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Garden\Commands\Water;

use Tests\Fixtures\Bus\Garden\Commands\Water\WaterCommand;

final class WaterHandler
{
    public function handle(WaterCommand $command): void {}
}
