<?php

declare(strict_types=1);

namespace App\Contracts\Asks;

use App\Contracts\Bus\Command;
use App\Values\AskTypeKey;
use App\Values\SubjectType;
use DateInterval;

interface AskType
{
    /**
     * The key asks of this type are routed and stored under.
     */
    public function key(): AskTypeKey;

    /**
     * The kind of record an ask of this type is about.
     */
    public function subject(): SubjectType;

    /**
     * The resolver that works out what an ask of this type is about.
     */
    public function resolver(): AskSubjectResolver;

    /**
     * The registered command whose admission an answer to this ask needs.
     *
     * @return class-string<Command<mixed>>
     */
    public function requiredCommand(): string;

    /**
     * How long an ask of this type may wait for an answer before it moves up.
     */
    public function allowance(): DateInterval;
}
