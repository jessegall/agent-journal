<?php

declare(strict_types=1);

namespace App\Supervision\Contracts;

use App\Records\Support\RecordIdentity;
use App\Supervision\Values\AskReference;
use App\Supervision\Values\AskSubject;
use App\Supervision\Values\SubjectType;

interface AskSubjectResolver
{
    public function resolve(SubjectType $type, AskReference $chain, RecordIdentity|null $work): AskSubject;
}
