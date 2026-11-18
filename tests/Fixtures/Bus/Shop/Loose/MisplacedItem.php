<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Loose;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Tests\Fixtures\Bus\Shop\Handlers\RemoveItemHandler;

/**
 * @implements Command<mixed>
 */
#[HandledBy(RemoveItemHandler::class)]
final readonly class MisplacedItem implements Command
{
    public function __construct() {}
}
