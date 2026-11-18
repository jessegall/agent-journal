<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Cards\Commands;

use App\Core\Bus\Attributes\HandledBy;
use App\Core\Bus\Contracts\Command;
use Tests\Fixtures\Modules\Cards\Handlers\ShuffleDeckHandler;

/**
 * @implements Command<string>
 */
#[HandledBy(ShuffleDeckHandler::class)]
final readonly class ShuffleDeck implements Command
{
    public function __construct(public string $deck) {}
}
