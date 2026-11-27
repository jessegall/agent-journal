<?php

declare(strict_types=1);

namespace App\Messages\Commands\KeepClosingWordsPrivate;

use App\Bus\Contracts\CommandHandler;
use App\Models\Drivers\DriverTurn;

final readonly class KeepClosingWordsPrivateHandler implements CommandHandler
{
    public function handle(KeepClosingWordsPrivateCommand $command): void
    {
        $turn = DriverTurn::findForSessionTurn($command->sessionId, $command->turnId);

        if ($turn === null) {
            return;
        }

        $turn->keepClosingWordsPrivate();
    }
}
