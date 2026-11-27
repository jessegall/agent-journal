<?php

declare(strict_types=1);

namespace App\Sessions\Commands\CertifyStopCheck;

use App\Bus\Contracts\CommandHandler;
use App\Models\Sessions\StopCheck;

final readonly class CertifyStopCheckHandler implements CommandHandler
{
    public function handle(CertifyStopCheckCommand $command): void
    {
        StopCheck::findOfStop($command->stop())->certify();
    }
}
