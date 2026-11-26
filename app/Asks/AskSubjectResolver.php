<?php

declare(strict_types=1);

namespace App\Asks;

use App\Asks\Contracts\AskSubjectResolver as AskSubjectResolverContract;
use App\Asks\Exceptions\AskRefused;
use App\Asks\Values\AskSubject;
use App\Asks\Values\SubjectType;
use App\Records\Contracts\RecordResolver;
use App\Support\RecordIdentity;
use App\Values\AskReference;
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
