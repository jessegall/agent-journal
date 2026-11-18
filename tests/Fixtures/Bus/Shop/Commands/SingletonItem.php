<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Tests\Fixtures\Bus\Shop\Handlers\SingletonHandler;

/**
 * @implements Command<mixed>
 */
#[HandledBy(SingletonHandler::class)]
final readonly class SingletonItem implements Command
{
    public function __construct() {}
}
