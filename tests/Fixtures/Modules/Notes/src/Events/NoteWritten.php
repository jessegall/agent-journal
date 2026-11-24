<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Events;

use App\Contracts\Events\Event;
use Tests\Fixtures\Modules\Notes\Commands\RecordNoteEffect\RecordNoteEffectCommand;

/**
 * A note was written in the fixture module.
 */
final readonly class NoteWritten implements Event
{
    /**
     * @param list<RecordNoteEffectCommand> $ordinary
     * @param list<RecordNoteEffectCommand> $marked
     */
    public function __construct(
        public bool $listenerFails = false,
        public array $ordinary = [],
        public array $marked = [],
        public bool $asksForGuide = false,
    ) {}
}
