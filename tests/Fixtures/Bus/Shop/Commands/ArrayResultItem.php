<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use Tests\Fixtures\Bus\Shop\Handlers\ArrayResultHandler;

/**
 * @extends Command<mixed>
 */
#[HandledBy(ArrayResultHandler::class)]
final readonly class ArrayResultItem extends Command
{
    public function __construct() {}
}
