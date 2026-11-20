<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States;

enum TaskWatchOutcome: string
{
    case Finished = 'finished';
    case Cancelled = 'cancelled';
}
