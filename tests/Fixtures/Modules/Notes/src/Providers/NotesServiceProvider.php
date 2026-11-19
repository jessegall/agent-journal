<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Providers;

use App\Links\Support\LinkTypeRegistry;
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
    public function register(): void
    {
        $this->app->bind(NoteResolver::class, NoteRecords::class);
    }

    public function boot(LinkTypeRegistry $links): void
    {
        $links->register([Note::LINK_TYPE => Note::class, NotePage::LINK_TYPE => NotePage::class, NoteSnapshot::LINK_TYPE => NoteSnapshot::class]);
    }
}
