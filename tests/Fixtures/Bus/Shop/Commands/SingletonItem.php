<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use Tests\Fixtures\Bus\Shop\Handlers\SingletonHandler;

/**
 * @extends Command<mixed>
 */
#[HandledBy(SingletonHandler::class)]
final readonly class SingletonItem extends Command
{
    public function __construct() {}
}
