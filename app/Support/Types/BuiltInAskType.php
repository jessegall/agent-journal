<?php

declare(strict_types=1);

namespace App\Support\Types;

use App\Asks\Contracts\AskSubjectResolver;
use App\Asks\Contracts\AskType;
use App\Asks\Enums\CoreAskType;
use App\Asks\Values\SubjectType;
use App\Values\AskTypeKey;
use DateInterval;

final readonly class BuiltInAskType implements AskType
{
    /**
     * Takes the subjects an ask of a built-in type may be about.
     */
    private function __construct(private AskSubjectResolver $subjects, private CoreAskType $definition) {}

    public static function question(AskSubjectResolver $subjects): self
    {
        return new self($subjects, CoreAskType::Question);
    }

    public static function stuck(AskSubjectResolver $subjects): self
    {
        return new self($subjects, CoreAskType::Stuck);
    }

    public function key(): AskTypeKey
    {
        return $this->definition->key();
    }

    public function subject(): SubjectType
    {
        return $this->definition->subject();
    }

    public function resolver(): AskSubjectResolver
    {
        return $this->subjects;
    }

    public function requiredCommand(): string
    {
        return $this->definition->requiredCommand();
    }

    public function allowance(): DateInterval
    {
        return new DateInterval('PT'.$this->definition->minutes().'M');
    }
}
