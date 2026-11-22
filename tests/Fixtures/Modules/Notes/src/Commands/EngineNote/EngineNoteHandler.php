<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands\EngineNote;

use App\Contracts\CommandHandler;
use Tests\Fixtures\Modules\Notes\Commands\EngineNote\EngineNoteCommand;

final class EngineNoteHandler implements CommandHandler
{
    public function handle(EngineNoteCommand $command): int
    {
        return strlen($command->text);
    }
}
