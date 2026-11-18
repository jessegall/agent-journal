<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Handlers;

use App\Contracts\CommandHandler;
use Tests\Fixtures\Modules\Notes\Commands\SystemNote;

final class SystemNoteHandler implements CommandHandler
{
    public function handle(SystemNote $command): int
    {
        return strlen($command->text);
    }
}
