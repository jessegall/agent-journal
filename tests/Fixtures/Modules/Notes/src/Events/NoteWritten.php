<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Events;

use App\Contracts\Event;
use Tests\Fixtures\Modules\Notes\Commands\RecordNoteEffect;

/**
 * A note was written in the fixture module.
 */
final readonly class NoteWritten implements Event
{
    /**
     * @param list<RecordNoteEffect> $ordinary
     * @param list<RecordNoteEffect> $marked
     */
    public function __construct(
        public bool $listenerFails = false,
        public array $ordinary = [],
        public array $marked = [],
    ) {}
}
