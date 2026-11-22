<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Values\AdmittedAsk;
use App\Values\AskReference;

interface AskAdmission
{
    /**
     * @param  class-string<Command<mixed>>  $command  the command the answer runs, which the ask's type must require
     */
    public function requireCurrent(AskReference $ask, string $command, int $expectedVersion): AdmittedAsk;
}
