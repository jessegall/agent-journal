<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Loose;

use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use Tests\Fixtures\Bus\Shop\Handlers\RemoveItemHandler;

/**
 * @extends Command<mixed>
 */
#[HandledBy(RemoveItemHandler::class)]
final readonly class MisplacedItem extends Command
{
    public function __construct() {}
}
