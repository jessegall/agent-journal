<?php

declare(strict_types=1);

namespace App\Supervision\Values;

use App\Agents\Values\WorkReference;

final readonly class AskSubject
{
    public function __construct(
        public SubjectType $type,
        public WorkReference $work,
        public string|null $head = null,
    ) {}
}
