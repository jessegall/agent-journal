<?php

declare(strict_types=1);

namespace App\Supervision\Support;

use App\Agents\Values\WorkReference;
use App\Records\Contracts\RecordResolver;
use App\Records\Support\RecordIdentity;
use App\Supervision\Contracts\AskSubjectResolver;
use App\Supervision\Exceptions\AskRefused;
use App\Supervision\Values\AskReference;
use App\Supervision\Values\AskSubject;
use App\Supervision\Values\SubjectType;

final readonly class VisibleAskSubjects implements AskSubjectResolver
{
    public function __construct(private RecordResolver $records) {}

    public function resolve(SubjectType $type, AskReference $chain, RecordIdentity|null $work): AskSubject
    {
        if ($work !== null) {
            $this->records->requireReadable($work);

            return new AskSubject($type, WorkReference::forRecord($work));
        }

        if ($type->isWorkRequired) {
            throw AskRefused::workRequired($type);
        }

        return new AskSubject($type, WorkReference::free($chain->id));
    }
}
