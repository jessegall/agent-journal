<?php

declare(strict_types=1);

namespace App\Processes\Resolvers;

use App\Processes\Data\RunListData;
use App\Processes\Data\RunRowData;
use App\Processes\Models\PartRun;
use App\Processes\Models\ProcessRun;
use App\Processes\Support\ProjectKey;
use App\Ui\Contracts\PageResolver;

/**
 * The current project's newest runs the viewer may see (rule 4), each with the operations of its parts.
 */
final readonly class RunsWindowResolver implements PageResolver
{
    public function __construct(private ProjectKey $projects) {}

    public function read(): RunListData
    {
        $runs = ProcessRun::query()->forActor()->where('project_key', $this->projects->current())->readLimit(50)->get();
        $operations = PartRun::query()
            ->whereIn('process_run_id', $runs->modelKeys())
            ->readLimit(1_000)
            ->get()
            ->groupBy('process_run_id');

        return RunListData::from(['runs' => array_values($runs->map(fn (ProcessRun $run) => RunRowData::fromRun(
            $run,
            array_values(array_unique($operations->get($run->id)?->pluck('operation')->all() ?? [])),
        ))->all())]);
    }
}
