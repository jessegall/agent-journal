<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use Tests\Fixtures\Bus\Shop\Handlers\AddItemHandler;

/**
 * @extends Command<mixed>
 */
#[HandledBy(AddItemHandler::class)]
final readonly class TwinItem extends Command
{
    public function __construct() {}
}
