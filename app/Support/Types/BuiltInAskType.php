<?php

declare(strict_types=1);

namespace App\Support\Types;

use App\Asks\AskSubjectResolver;
use App\Asks\Contracts\AskSubjectResolver as AskSubjectResolverContract;
use App\Asks\Contracts\AskType;
use App\Asks\Enums\CoreAskType;
use App\Asks\Values\SubjectType;
use App\Values\AskTypeKey;
use DateInterval;

abstract readonly class BuiltInAskType implements AskType
{
    /**
     * Takes the subjects an ask of a built-in type may be about.
     */
    public function __construct(private AskSubjectResolver $subjects) {}

    public function key(): AskTypeKey
    {
        return $this->definition()->key();
    }

    public function subject(): SubjectType
    {
        return $this->definition()->subject();
    }

    public function resolver(): AskSubjectResolverContract
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

    /**
     * The built-in ask type this class stands for.
     */
    abstract protected function definition(): CoreAskType;
}
