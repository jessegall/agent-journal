<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes;

use App\Domain\Contracts\Domain;
use App\Domain\Contracts\ProvidesAssignables;
use App\Domain\Contracts\ProvidesStates;
use Tests\Fixtures\Modules\Notes\Api\NoteValue;
use Tests\Fixtures\Modules\Notes\Contracts\NoteReader;
use Tests\Fixtures\Modules\Notes\Models\Note;
use Tests\Fixtures\Modules\Notes\Support\NoteAssignments;

/**
 * A module installed outside app/Domain, registered beside the domains only in the architecture fixtures.
 */
final class NotesDomain implements Domain, ProvidesAssignables, ProvidesStates
{
    public function description(): string
    {
        return 'Notes an agent writes while it works: a module outside app/Domain.';
    }

    public function requires(): array
    {
        return [];
    }

    /**
     * @return list<class-string>
     */
    public function exports(): array
    {
        return [NoteReader::class, NoteValue::class];
    }

    public function states(): array
    {
        return ['notes.writing' => WritingNoteStateFactory::class];
    }

    public function assignables(): array
    {
        return [Note::LINK_TYPE => NoteAssignments::class];
    }
}
