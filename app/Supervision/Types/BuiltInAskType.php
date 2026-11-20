<?php

declare(strict_types=1);

namespace App\Supervision\Types;

use App\Profiles\Values\AskTypeKey;
use App\Supervision\Contracts\AskSubjectResolver;
use App\Supervision\Contracts\AskType;
use App\Supervision\Enums\CoreAskType;
use App\Supervision\Support\VisibleAskSubjects;
use App\Supervision\Values\SubjectType;
use DateInterval;

abstract readonly class BuiltInAskType implements AskType
{
    public function __construct(private VisibleAskSubjects $subjects) {}

    public function key(): AskTypeKey
    {
        return $this->definition()->key();
    }

    public function subject(): SubjectType
    {
        return $this->definition()->subject();
    }

    public function resolver(): AskSubjectResolver
    {
        return $this->subjects;
    }

    public function requiredCommand(): string
    {
        return $this->definition()->requiredCommand();
    }

    public function allowance(): DateInterval
    {
        return new DateInterval('PT'.$this->definition()->minutes().'M');
    }

    abstract protected function definition(): CoreAskType;
}
