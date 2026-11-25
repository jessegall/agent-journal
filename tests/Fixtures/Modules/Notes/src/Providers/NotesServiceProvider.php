<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Providers;

use App\Support\Sources\Contracts\DockRegistration;
use Tests\Fixtures\Modules\Notes\Support\NoteDocking;
use Tests\Fixtures\Modules\Notes\Support\NotesTally;
use Tests\Fixtures\Modules\Notes\Support\NotesTallyDocking;
use Tests\Fixtures\Modules\Notes\Support\ReleaseReview;
use Tests\Fixtures\Modules\Notes\Support\ReleaseReviewDocking;
use Illuminate\Support\ServiceProvider;
use Tests\Fixtures\Modules\Notes\Contracts\NoteResolver;
use Tests\Fixtures\Modules\Notes\Models\Note;
use Tests\Fixtures\Modules\Notes\Models\NotePage;
use Tests\Fixtures\Modules\Notes\Models\NoteSnapshot;
use Tests\Fixtures\Modules\Notes\NoteRecords;

/**
 * Binds the module's reader and registers the stable link name of its note; the module registers its provider itself,
 * as a package does.
 */
final class NotesServiceProvider extends ServiceProvider
{
    /**
     * The type the notes tally docks under; it has no row of its own.
     */
    public const string TALLY_TYPE = 'notes.tally';

    /**
     * The type the release review docks under, the card that uses every part.
     */
    public const string REVIEW_TYPE = 'notes.release-review';

    public function register(): void
    {
        $this->app->bind(NoteResolver::class, NoteRecords::class);
    }

    public function boot(DockRegistration $docks): void
    {
        $docks->offerDockFor($docks->register(Note::linkType(), Note::class, NoteDocking::class));
        $docks->offerDockFor($docks->register(self::TALLY_TYPE, NotesTally::class, NotesTallyDocking::class));
        $docks->offerDockFor($docks->register(self::REVIEW_TYPE, ReleaseReview::class, ReleaseReviewDocking::class));
    }
}
