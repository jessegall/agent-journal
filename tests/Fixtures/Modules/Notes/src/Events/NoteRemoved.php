<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Events;

use App\Contracts\Events\Event;
use App\Records\Contracts\RecordDeleted;
use Tests\Fixtures\Modules\Notes\Models\Note;

/**
 * A note was deleted for good, after the deletion committed.
 */
final readonly class NoteRemoved implements Event, RecordDeleted
{
    public function __construct(public string $noteId) {}

    public function recordType(): string
    {
        return Note::linkType();
    }

    public function recordId(): string
    {
        return $this->noteId;
    }
}
