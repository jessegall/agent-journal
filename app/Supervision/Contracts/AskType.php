<?php

declare(strict_types=1);

namespace App\Supervision\Contracts;

use App\Bus\Contracts\Command;
use App\Profiles\Values\AskTypeKey;
use App\Supervision\Values\SubjectType;
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
