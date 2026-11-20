<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Events;

use App\Contracts\Event;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A note published after its producer commits.
 */
final readonly class NotePublished implements Event, ShouldDispatchAfterCommit
{
    public function __construct(public NoteWritten $note) {}
}
