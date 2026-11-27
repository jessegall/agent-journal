<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Support;

use Closure;
use Illuminate\Container\Attributes\Scoped;
use Tests\Fixtures\Modules\Notes\Commands\RecordNoteEffect\RecordNoteEffectCommand;

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
     * @var list<Closure(RecordNoteEffectCommand): void>
     */
    private array $afterRecording = [];

    /**
     * @param  Closure(RecordNoteEffectCommand): void  $callback
     */
    public function afterRecording(Closure $callback): void
    {
        $this->afterRecording[] = $callback;
    }

    public function record(RecordNoteEffectCommand $command): void
    {
        $this->labels[] = $command->label;

        foreach ($this->afterRecording as $callback) {
            $callback($command);
        }
    }
}
