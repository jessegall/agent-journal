<?php

declare(strict_types=1);

namespace App\Asks\Contracts;

use App\Asks\Values\AskSubject;
use App\Asks\Values\SubjectType;
use App\Support\RecordIdentity;
use App\Values\AskReference;

interface AskSubjectResolver
{
    /**
     * What an ask of the subject type in the chain is about, for the work when it names some.
     */
    public function resolve(SubjectType $type, AskReference $chain, RecordIdentity|null $work): AskSubject;
}
