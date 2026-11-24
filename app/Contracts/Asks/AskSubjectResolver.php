<?php

declare(strict_types=1);

namespace App\Contracts\Asks;

use App\Support\RecordIdentity;
use App\Values\AskReference;
use App\Values\AskSubject;
use App\Values\SubjectType;

interface AskSubjectResolver
{
    /**
     * What an ask of the subject type in the chain is about, for the work when it names some.
     */
    public function resolve(SubjectType $type, AskReference $chain, RecordIdentity|null $work): AskSubject;
}
