<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands;

use App\Core\Bus\Attributes\HandledBy;
use App\Core\Bus\Contracts\Command;
use Tests\Fixtures\Bus\Shop\Handlers\AddItemHandler;

/**
 * @implements Command<mixed>
 */
#[HandledBy(AddItemHandler::class)]
final readonly class TwinItem implements Command
{
    public function __construct() {}
}
