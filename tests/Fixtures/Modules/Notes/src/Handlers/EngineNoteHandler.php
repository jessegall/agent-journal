<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Handlers;

use App\Contracts\CommandHandler;
use Tests\Fixtures\Modules\Notes\Commands\EngineNote;

final class EngineNoteHandler implements CommandHandler
{
    public function handle(EngineNote $command): int
    {
        return strlen($command->text);
    }
}
