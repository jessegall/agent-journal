<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands\RecordNoteEffect;

use App\Bus\Contracts\CommandHandler;
use Tests\Fixtures\Modules\Notes\Support\NoteEffects;

final readonly class RecordNoteEffectHandler implements CommandHandler
{
    public function __construct(private NoteEffects $effects) {}

    public function handle(RecordNoteEffectCommand $command): void
    {
        $this->effects->record($command);
    }
}
