<?php

declare(strict_types=1);

namespace Domain\Helpers\Resolvers;

use App\Contracts\Navigation\PageResolver;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use Domain\Helpers\Models\HelperJob;
use Illuminate\Support\Str;

/**
 * The Helper jobs window, declared as a layout: how many jobs are still open and the newest jobs by brief and state,
 * read in two bounded queries.
 */
final readonly class HelperJobsLayoutResolver implements PageResolver
{
    /**
     * The most jobs the window lists.
     */
    private const int JOB_LIMIT = 25;

    public function read(): DeclaredLayoutData
    {
        $jobs = HelperJob::newest(self::JOB_LIMIT);
        $title = LayoutPartData::text('title', 'Helper jobs', 'heading');

        if ($jobs->isEmpty()) {
            return DeclaredLayoutData::of(LayoutPartData::box(
                'helper-jobs',
                'stack',
                $title,
                LayoutPartData::notice('none', 'empty', 'No helper has had a job yet'),
            ));
        }

        $openCount = HelperJob::openCount();

        return DeclaredLayoutData::of(LayoutPartData::box(
            'helper-jobs',
            'stack',
            $title,
            LayoutPartData::text('open', $openCount === 1 ? '1 job is open' : "{$openCount} jobs are open", 'muted'),
            LayoutPartData::collection('jobs', 'list', array_values($jobs->map(fn (HelperJob $job) => new LayoutRowData(
                $job->id,
                Str::limit($job->brief, 80),
                $job->state->label(),
            ))->all())),
        ));
    }
}
