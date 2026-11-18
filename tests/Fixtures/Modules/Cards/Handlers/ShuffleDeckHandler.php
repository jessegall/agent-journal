<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Cards\Handlers;

use Tests\Fixtures\Modules\Cards\Commands\ShuffleDeck;

final class ShuffleDeckHandler
{
    public function handle(ShuffleDeck $command): string
    {
        return "shuffled {$command->deck}";
    }
}
