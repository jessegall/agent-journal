<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Cards\Commands\DrawCard;

use App\Contracts\CommandHandler;
use Tests\Fixtures\Modules\Cards\Commands\DrawCard\DrawCardCommand;

final class DrawCardHandler implements CommandHandler
{
    public function handle(DrawCardCommand $command): string
    {
        return "card from {$command->deck}";
    }
}
