<?php

declare(strict_types=1);

namespace App\Supervision\Contracts;

use App\Agents\Values\OperationKey;
use App\Profiles\Values\AskTypeKey;
use App\Supervision\Values\SubjectType;
use DateInterval;

interface AskType
{
    public function key(): AskTypeKey;

    public function subject(): SubjectType;

    public function resolver(): AskSubjectResolver;

    public function operation(): OperationKey;

    public function allowance(): DateInterval;
}
