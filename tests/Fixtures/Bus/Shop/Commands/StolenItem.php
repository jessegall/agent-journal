<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use Tests\Fixtures\Bus\Garden\Handlers\WaterHandler;

/**
 * @extends Command<mixed>
 */
#[HandledBy(WaterHandler::class)]
final readonly class StolenItem extends Command
{
    public function __construct() {}
}
