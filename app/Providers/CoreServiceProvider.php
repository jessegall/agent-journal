<?php

declare(strict_types=1);

namespace App\Providers;

use App\Contracts\Assignments\AssignmentRegistration;
use App\Contracts\Bus\PipelineRunner as PipelineRunnerContract;
use App\Contracts\Processes\StatementDeadlines;
use App\Contracts\Search\MessageSearch;
use App\Contracts\Search\RecordSearch;
use App\Contracts\Search\SearchSources;
use App\Contracts\Search\TieredSearch;
use App\Enums\AssignmentPurpose;
use App\Models\Asks\Ask;
use App\Support\AskAssignments;
use App\Support\FolderClasses;
use App\Support\MessageSearchProvider;
use App\Support\PipelineRunner;
use App\Support\SearchCoordinator;
use App\Support\SearchEligibility;
use App\Support\StatementDeadline;
use App\Support\TieredRecordSearch;
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
        $this->app->bind(TieredSearch::class, TieredRecordSearch::class);
        $this->app->bind(RecordSearch::class, SearchCoordinator::class);
        $this->app->bind(SearchSources::class, SearchEligibility::class);
        $this->app->bind(StatementDeadlines::class, StatementDeadline::class);
        $this->app->bind(MessageSearch::class, MessageSearchProvider::class);
    }

    public function boot(AssignmentRegistration $assignments): void
    {
        // Core's Artisan commands, app/Console/Commands, for the console and for the journal routes that list them.
        $this->commands(FolderClasses::in(dirname(__DIR__).'/Console/Commands', Command::class));

        $assignments->registerOwner('Supervision', []);

        $assignments->registerRecord(
            Ask::linkType(),
            AskAssignments::class,
            'Supervision',
            AssignmentPurpose::JournalAssigned,
        );

    }
}
