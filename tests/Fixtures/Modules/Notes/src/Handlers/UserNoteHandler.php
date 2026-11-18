<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Handlers;

use App\Contracts\CommandHandler;
use Tests\Fixtures\Modules\Notes\Commands\UserNote;

final class UserNoteHandler implements CommandHandler
{
    public function handle(UserNote $command): int
    {
        return strlen($command->text);
    }
}
