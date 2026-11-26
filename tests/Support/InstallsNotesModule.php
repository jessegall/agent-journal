<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Numbers\NumberedTypeRegistry;
use App\Support\DomainEntry;
use Tests\Fixtures\Modules\Notes\NotesDomain;
use Tests\Fixtures\Modules\Notes\Providers\NotesServiceProvider;

/**
 * Installs the Notes fixture module as a package would, after the application booted: its tables, its provider, its
 * domain declarations and the check of the models it numbers; and drops its tables again.
 */
trait InstallsNotesModule
{
    protected function createNotesTables(): void
    {
        foreach ($this->notesMigrations() as $migration) {
            (require $migration)->up();
        }
    }

    protected function dropNotesTables(): void
    {
        foreach (array_reverse($this->notesMigrations()) as $migration) {
            (require $migration)->down();
        }
    }

    protected function installNotesModule(): void
    {
        DomainEntry::fromClass(NotesDomain::class)->boot($this->app);
        $this->app->register(NotesServiceProvider::class);
        $this->app->make(NumberedTypeRegistry::class)->checkDeclarations();
    }

    /**
     * @return list<string>
     */
    private function notesMigrations(): array
    {
        return glob(base_path('tests/Fixtures/Modules/Notes/database/migrations/*.php')) ?: [];
    }
}
