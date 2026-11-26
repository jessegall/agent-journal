<?php

declare(strict_types=1);

namespace Domain\Sequences\Providers;

use App\Records\Contracts\RecordSummaries;
use Domain\Sequences\Models\SequenceRun;
use Domain\Sequences\Support\SequenceRunSummaries;
use Illuminate\Support\ServiceProvider;

/**
 * Registers a sequence run's summary, as the chat lines that show a run read it.
 */
final class SequencesServiceProvider extends ServiceProvider
{
    public function boot(RecordSummaries $summaries): void
    {
        $summaries->register(SequenceRun::linkType(), SequenceRunSummaries::class);
    }
}
