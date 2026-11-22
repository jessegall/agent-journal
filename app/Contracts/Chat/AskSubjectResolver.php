<?php

declare(strict_types=1);

namespace App\Contracts\Chat;

use App\Support\RecordIdentity;
use App\Values\AskReference;
use App\Values\AskSubject;
use App\Values\SubjectType;

interface AskSubjectResolver
{
    public function resolve(SubjectType $type, AskReference $chain, RecordIdentity|null $work): AskSubject;
}
