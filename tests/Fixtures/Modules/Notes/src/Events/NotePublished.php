<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Events;

use App\Contracts\Events\Event;

/**
 * A note published after its producer commits.
 */
final readonly class NotePublished implements Event
{
    public function __construct(public NoteWritten $note) {}
}
