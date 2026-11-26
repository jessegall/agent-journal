<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Providers;

use App\Records\Contracts\RecordSummaries;
use Illuminate\Support\ServiceProvider;
use Tests\Fixtures\Modules\Notes\Contracts\NoteResolver;
use Tests\Fixtures\Modules\Notes\Models\Note;
use Tests\Fixtures\Modules\Notes\NoteRecords;
use Tests\Fixtures\Modules\Notes\Support\NoteSummaries;

/**
 * Binds the module's reader and registers its note's summary, which a conversation docks; the module registers its
 * provider itself, as a package does.
 */
final class NotesServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(NoteResolver::class, NoteRecords::class);
    }

    public function boot(RecordSummaries $summaries): void
    {
        $summaries->register(Note::linkType(), NoteSummaries::class);
    }
}
