<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Cards\Handlers;

use App\Contracts\CommandHandler;
use Tests\Fixtures\Modules\Cards\Commands\ShuffleDeck;

final class ShuffleDeckHandler implements CommandHandler
{
    public function handle(ShuffleDeck $command): string
    {
        return "shuffled {$command->deck}";
    }
}
