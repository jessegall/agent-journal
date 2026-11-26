<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Cards\Commands\ShuffleDeck;

use App\Bus\Contracts\CommandHandler;

final class ShuffleDeckHandler implements CommandHandler
{
    public function handle(ShuffleDeckCommand $command): string
    {
        return "shuffled {$command->deck}";
    }
}
