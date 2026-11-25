<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Asks\AskSubjectResolver as AskSubjectResolverContract;
use App\Contracts\Records\RecordResolver;
use App\Exceptions\AskRefused;
use App\Values\AskReference;
use App\Values\AskSubject;
use App\Values\SubjectType;
use App\Values\WorkReference;

final readonly class AskSubjectResolver implements AskSubjectResolverContract
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
