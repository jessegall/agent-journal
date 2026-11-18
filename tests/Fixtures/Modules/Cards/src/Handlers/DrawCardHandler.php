<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Cards\Handlers;

use App\Contracts\CommandHandler;
use Tests\Fixtures\Modules\Cards\Commands\DrawCard;

final class DrawCardHandler implements CommandHandler
{
    public function handle(DrawCard $command): string
    {
        return "card from {$command->deck}";
    }
}
