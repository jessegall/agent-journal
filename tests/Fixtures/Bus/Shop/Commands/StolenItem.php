<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Tests\Fixtures\Bus\Garden\Handlers\WaterHandler;

/**
 * @implements Command<mixed>
 */
#[HandledBy(WaterHandler::class)]
final readonly class StolenItem implements Command
{
    public function __construct() {}
}
