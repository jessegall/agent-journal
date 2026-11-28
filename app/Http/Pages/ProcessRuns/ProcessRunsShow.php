<?php

declare(strict_types=1);

namespace App\Http\Pages\ProcessRuns;

use App\Processes\Data\RunWindowData;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\DetailPage;
use App\Support\Layout\LayoutBackData;
use App\Support\Layout\LayoutNativeData;
use App\Support\Layout\LayoutPartData;

/**
 * One run's page on the shared reader recipe, drawn by its native run view; a run that is not there is the removed
 * notice with Back to the runs.
 */
final readonly class ProcessRunsShow extends ProcessRunsPage
{
    public function of(RunWindowData $detail): DeclaredLayoutData
    {
        return DetailPage::make("Run {$detail->snapshot->runId}")
            ->withStanding(LayoutPartData::build()
                ->asNative()
                ->key('detail')
                ->native(LayoutNativeData::build()->component('processes/RunView')->props($detail)->finish())
                ->finish())
            ->layout();
    }

    public function removed(): DeclaredLayoutData
    {
        return DetailPage::removed('run', LayoutBackData::build()
            ->href('/processes/runs')
            ->label('Runs')
            ->finish());
    }
}
