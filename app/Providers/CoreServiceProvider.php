<?php

declare(strict_types=1);

namespace App\Providers;

use App\Assignments\Contracts\AssignmentRegistration;
use App\Assignments\Enums\AssignmentPurpose;
use App\Assignments\JournalAssignableProvider;
use App\Bus\Contracts\PipelineRunner as PipelineRunnerContract;
use App\Messages\MessageSearch;
use App\Models\Asks\Ask;
use App\Pipelines\Support\PipelineRunner;
use App\Processes\Contracts\StatementDeadlines as StatementDeadlinesContract;
use App\Search\Contracts\MessageSearch as MessageSearchContract;
use App\Search\Contracts\RecordSearch as RecordSearchContract;
use App\Search\Contracts\SearchSources as SearchSourcesContract;
use App\Search\Contracts\TieredSearch as TieredSearchContract;
use App\Search\RecordSearch;
use App\Search\SearchSources;
use App\Search\StatementDeadlines;
use App\Search\TieredSearch;
use App\Support\ProjectCode;
use Illuminate\Support\ServiceProvider;

/**
 * Loads the core that every domain and module builds on: the migrations and listeners of its agents, hooks and links.
 * The core names no domain; domains and modules plug into it.
 */
final class CoreServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(PipelineRunnerContract::class, PipelineRunner::class);
        $this->app->bind(TieredSearchContract::class, TieredSearch::class);
        $this->app->bind(RecordSearchContract::class, RecordSearch::class);
        $this->app->bind(SearchSourcesContract::class, SearchSources::class);
        $this->app->bind(StatementDeadlinesContract::class, StatementDeadlines::class);
        $this->app->bind(MessageSearchContract::class, MessageSearch::class);
    }

    public function boot(AssignmentRegistration $assignments): void
    {
        // Core's Artisan commands, app/Console/Commands, for the console and for the journal routes that list them.
        $this->commands(ProjectCode::consoleCommandsIn(dirname(__DIR__)));

        $assignments->registerOwner('Supervision', []);

        $assignments->registerRecord(
            Ask::linkType(),
            JournalAssignableProvider::class,
            'Supervision',
            AssignmentPurpose::JournalAssigned,
        );

    }
}
