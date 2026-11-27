<?php

declare(strict_types=1);

namespace App\Sessions\Commands\CertifyStopCheck;

use App\Bus\Contracts\CommandHandler;
use App\Models\Sessions\StopCheck;
use App\Sessions\StopCertification;

final readonly class CertifyStopCheckHandler implements CommandHandler
{
    public function __construct(private StopCertification $certification) {}

    public function handle(CertifyStopCheckCommand $command): void
    {
        $this->certification->certify(StopCheck::findOfStop($command->stop()));
    }
}
