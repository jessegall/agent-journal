<?php

declare(strict_types=1);

namespace App\Providers;

use App\Contracts\Assignments\AssignmentRegistration;
use App\Contracts\Bus\PipelineRunner as PipelineRunnerContract;
use App\Contracts\Processes\StatementDeadlines as StatementDeadlinesContract;
use App\Contracts\Search\MessageSearch as MessageSearchContract;
use App\Contracts\Search\RecordSearch as RecordSearchContract;
use App\Contracts\Search\SearchSources as SearchSourcesContract;
use App\Contracts\Search\TieredSearch as TieredSearchContract;
use App\Enums\Assignments\AssignmentPurpose;
use App\Models\Asks\Ask;
use App\Support\FolderClasses;
use App\Support\JournalAssignableProvider;
use App\Support\MessageSearch;
use App\Support\PipelineRunner;
use App\Support\RecordSearch;
use App\Support\SearchSources;
use App\Support\StatementDeadlines;
use App\Support\TieredSearch;
use Illuminate\Console\Command;
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
        $this->commands(FolderClasses::in(dirname(__DIR__).'/Console/Commands', Command::class));

        $assignments->registerOwner('Supervision', []);

        $assignments->registerRecord(
            Ask::linkType(),
            JournalAssignableProvider::class,
            'Supervision',
            AssignmentPurpose::JournalAssigned,
        );

    }
}
