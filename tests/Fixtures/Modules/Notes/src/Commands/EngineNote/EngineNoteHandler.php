<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands\EngineNote;

use App\Bus\Contracts\CommandHandler;

final class EngineNoteHandler implements CommandHandler
{
    public function handle(EngineNoteCommand $command): int
    {
        return strlen($command->text);
    }
}
