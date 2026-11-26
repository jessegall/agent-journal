<?php

declare(strict_types=1);

namespace App\Access\Contracts;

use App\Access\Values\AdmittedAsk;
use App\Bus\Contracts\Command;
use App\Values\AskReference;

interface AskAdmission
{
    /**
     * @param  class-string<Command<mixed>>  $command  the command the answer runs, which the ask's type must require
     */
    public function requireCurrent(AskReference $ask, string $command, int $expectedVersion): AdmittedAsk;
}
