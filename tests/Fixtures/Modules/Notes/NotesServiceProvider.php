<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes;

use Illuminate\Support\ServiceProvider;
use Tests\Fixtures\Modules\Notes\Contracts\NoteReader;

/**
 * Binds the module's reader; the module registers its provider itself, as a package does.
 */
final class NotesServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(NoteReader::class, NoteRecords::class);
    }
}
