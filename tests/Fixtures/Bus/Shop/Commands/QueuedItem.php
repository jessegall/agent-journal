<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands;

use App\Core\Bus\Attributes\HandledBy;
use App\Core\Bus\Contracts\Command;
use Illuminate\Contracts\Queue\ShouldQueue;
use Tests\Fixtures\Bus\Shop\Handlers\RemoveItemHandler;

/**
 * @implements Command<mixed>
 */
#[HandledBy(RemoveItemHandler::class)]
final readonly class QueuedItem implements Command, ShouldQueue
{
    public function __construct() {}
}
