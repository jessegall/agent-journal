<?php

declare(strict_types=1);

namespace App\Supervision\Contracts;

use App\Agents\Values\OperationKey;
use App\Supervision\Values\AdmittedAsk;
use App\Supervision\Values\AskReference;

interface AskAdmission
{
    public function requireCurrent(AskReference $ask, OperationKey $operation, int $expectedVersion): AdmittedAsk;
}
