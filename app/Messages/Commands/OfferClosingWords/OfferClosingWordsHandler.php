<?php

declare(strict_types=1);

namespace App\Messages\Commands\OfferClosingWords;

use App\Bus\Contracts\CommandHandler;
use App\Models\Drivers\DriverTurn;

final readonly class OfferClosingWordsHandler implements CommandHandler
{
    public function handle(OfferClosingWordsCommand $command): void
    {
        DriverTurn::findForSessionTurn($command->sessionId, $command->turnId)?->offerClosingWords($command->words);
    }
}
