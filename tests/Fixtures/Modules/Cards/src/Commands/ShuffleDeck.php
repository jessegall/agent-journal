<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Cards\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Tests\Fixtures\Modules\Cards\Handlers\ShuffleDeckHandler;

/**
 * @implements Command<string>
 */
#[HandledBy(ShuffleDeckHandler::class)]
final readonly class ShuffleDeck implements Command
{
    public function __construct(public string $deck) {}
}
