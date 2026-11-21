<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Events;

use App\Contracts\Event;
use App\Docking\Sources\Contracts\DockSourceDeleted;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;
use Tests\Fixtures\Modules\Notes\Models\Note;

/**
 * A note was deleted for good, after the deletion committed.
 */
final readonly class NoteRemoved implements DockSourceDeleted, Event, ShouldDispatchAfterCommit
{
    public function __construct(public string $noteId) {}

    public function dockType(): string
    {
        return Note::LINK_TYPE;
    }

    public function dockId(): string
    {
        return $this->noteId;
    }
}
