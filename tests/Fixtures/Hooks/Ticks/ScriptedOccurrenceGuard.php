<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Ticks;

use App\Hooks\Contracts\WorkOccurrenceGuard;
use App\Hooks\Exceptions\WorkOccurrenceStale;
use App\Hooks\Values\WorkOccurrence;

/**
 * The occurrence guard of the ticking fixtures: an occurrence a test names as over is refused; the rest are live.
 */
final class ScriptedOccurrenceGuard implements WorkOccurrenceGuard
{
    /**
     * @var list<string>
     */
    public array $finishedSubjects = [];

    /**
     * @var list<WorkOccurrence>
     */
    public array $checked = [];

    public function lockAndRequireLive(WorkOccurrence $occurrence): void
    {
        $this->checked[] = $occurrence;

        if (in_array($occurrence->subjectId, $this->finishedSubjects, true)) {
            throw WorkOccurrenceStale::for($occurrence);
        }
    }
}
