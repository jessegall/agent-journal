<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands;

use App\Core\Bus\Attributes\HandledBy;
use App\Core\Bus\Contracts\Command;
use Tests\Fixtures\Bus\Shop\Handlers\SingletonHandler;

/**
 * @implements Command<mixed>
 */
#[HandledBy(SingletonHandler::class)]
final readonly class SingletonItem implements Command
{
    public function __construct() {}
}
