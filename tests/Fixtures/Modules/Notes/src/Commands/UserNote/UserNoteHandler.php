<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands\UserNote;

use App\Contracts\Bus\CommandHandler;
use Tests\Fixtures\Modules\Notes\Commands\UserNote\UserNoteCommand;

final class UserNoteHandler implements CommandHandler
{
    public function handle(UserNoteCommand $command): int
    {
        return strlen($command->text);
    }
}
