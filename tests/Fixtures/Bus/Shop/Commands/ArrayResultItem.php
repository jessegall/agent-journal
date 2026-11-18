<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands;

use App\Core\Bus\Attributes\HandledBy;
use App\Core\Bus\Contracts\Command;
use Tests\Fixtures\Bus\Shop\Handlers\ArrayResultHandler;

/**
 * @implements Command<mixed>
 */
#[HandledBy(ArrayResultHandler::class)]
final readonly class ArrayResultItem implements Command
{
    public function __construct() {}
}
