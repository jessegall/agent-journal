<?php

declare(strict_types=1);

namespace App\Asks\Values;

use App\Values\WorkReference;

final readonly class AskSubject
{
    public function __construct(
        public SubjectType $type,
        public WorkReference $work,
        public string|null $head = null,
    ) {}
}
