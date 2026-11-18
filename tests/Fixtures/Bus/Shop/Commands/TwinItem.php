<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Tests\Fixtures\Bus\Shop\Handlers\AddItemHandler;

/**
 * @implements Command<mixed>
 */
#[HandledBy(AddItemHandler::class)]
final readonly class TwinItem implements Command
{
    public function __construct() {}
}
