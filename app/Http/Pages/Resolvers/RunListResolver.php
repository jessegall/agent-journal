<?php

declare(strict_types=1);

namespace App\Http\Pages\Resolvers;

use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Navigation\Contracts\PageResolver;
use App\Processes\Data\RunRowData;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use Illuminate\Support\Collection;

/**
 * The selected project's newest runs the viewer may see as a list layout: what each ran, whether it was a
 * normal run or evidence only, its lifecycle and start, each opening its own run; a notice when there is none.
 */
final readonly class RunListResolver implements PageResolver
{
    public function read(): DeclaredLayoutData
    {
        $runs = ProcessRun::query()->forActor()->limit(50)->get();

        $operations = PartRun::query()
            ->ofRuns($runs->modelKeys())
            ->limit(1_000)
            ->get()
            ->groupBy('process_run_id');

        $rows = array_values($runs->map(fn (ProcessRun $run) => RunRowData::fromRun(
            $run,
            array_values(array_unique($operations->get($run->id, new Collection())->pluck('operation')->all())),
        ))->all());

        $list = $rows === []
            ? LayoutPartData::notice('empty', 'empty', 'No run yet.')
            : LayoutPartData::collection('runs', 'list', array_map(fn (RunRowData $run) => LayoutRowData::from([
                'key' => $run->id,
                'label' => "Run {$run->id}",
                'value' => $run->lifecycle,
                'detail' => implode(' · ', [
                    implode(', ', $run->operations),
                    $run->mode === 'evidence' ? 'evidence only' : 'normal',
                    "started {$run->startedAt}",
                ]),
                'href' => "/processes/runs/{$run->id}",
            ]), $rows));

        return DeclaredLayoutData::of(LayoutPartData::box(
            'runs-page',
            'stack',
            LayoutPartData::box('header', 'header', LayoutPartData::text('title', 'Runs', 'heading')),
            $list,
        ));
    }
}
