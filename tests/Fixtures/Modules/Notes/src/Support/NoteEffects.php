<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Support;

use Closure;
use Illuminate\Container\Attributes\Scoped;
use Tests\Fixtures\Modules\Notes\Commands\RecordNoteEffect;

/**
 * Records each effect and lets a test change the stack in between effects.
 */
#[Scoped]
final class NoteEffects
{
    /**
     * @var list<string>
     */
    public array $labels = [];

    /**
     * @var list<Closure(RecordNoteEffect): void>
     */
    private array $afterRecording = [];

    /**
     * @param Closure(RecordNoteEffect): void $callback
     */
    public function afterRecording(Closure $callback): void
    {
        $this->afterRecording[] = $callback;
    }

    public function record(RecordNoteEffect $command): void
    {
        $this->labels[] = $command->label;

        foreach ($this->afterRecording as $callback) {
            $callback($command);
        }
    }
}
