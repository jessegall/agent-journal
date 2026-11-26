<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Cards\Commands\DrawCard;

use App\Bus\Contracts\CommandHandler;

final class DrawCardHandler implements CommandHandler
{
    public function handle(DrawCardCommand $command): string
    {
        return "card from {$command->deck}";
    }
}
