<?php

declare(strict_types=1);

namespace App\Processes\Resolvers;

use App\Processes\Data\RunRowData;
use App\Processes\Models\PartRun;
use App\Processes\Models\ProcessRun;
use App\Processes\Support\ProjectKey;
use App\Ui\Contracts\PageResolver;
use App\Ui\Layout\DeclaredLayoutData;
use App\Ui\Layout\LayoutPartData;
use App\Ui\Layout\LayoutRowData;

/**
 * The current project's newest runs the viewer may see (rule 4) as a list layout: what each ran, whether it was a
 * normal run or evidence only, its lifecycle and start, each opening its own run; a notice when there is none.
 */
final readonly class RunListResolver implements PageResolver
{
    public function __construct(private ProjectKey $projects) {}

    public function read(): DeclaredLayoutData
    {
        $runs = ProcessRun::query()->forActor()->where('project_key', $this->projects->current())->limit(50)->get();

        $operations = PartRun::query()
            ->whereIn('process_run_id', $runs->modelKeys())
            ->readLimit(1_000)
            ->get()
            ->groupBy('process_run_id');

        $rows = array_values($runs->map(fn (ProcessRun $run) => RunRowData::fromRun(
            $run,
            array_values(array_unique($operations->get($run->id)?->pluck('operation')->all() ?? [])),
        ))->all());

        $list = $rows === []
            ? LayoutPartData::notice('empty', 'empty', 'No run yet.')
            : LayoutPartData::collection('runs', 'list', array_map(fn (RunRowData $run) => new LayoutRowData(
                $run->id,
                "Run {$run->id}",
                $run->lifecycle,
                detail: implode(' · ', [
                    implode(', ', $run->operations),
                    $run->mode === 'evidence' ? 'evidence only' : 'normal',
                    "started {$run->startedAt}",
                ]),
                href: "/processes/runs/{$run->id}",
            ), $rows));

        return DeclaredLayoutData::of(LayoutPartData::box(
            'runs-page',
            'stack',
            LayoutPartData::box('header', 'header', LayoutPartData::text('title', 'Runs', 'heading')),
            $list,
        ));
    }
}
