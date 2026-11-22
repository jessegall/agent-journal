<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Values\AskTypeKey;
use App\Values\SubjectType;
use DateInterval;

interface AskType
{
    public function key(): AskTypeKey;

    public function subject(): SubjectType;

    public function resolver(): AskSubjectResolver;

    /**
     * The registered command whose admission an answer to this ask needs.
     *
     * @return class-string<Command<mixed>>
     */
    public function requiredCommand(): string;

    public function allowance(): DateInterval;
}
