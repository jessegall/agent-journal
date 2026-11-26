<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands\UserNote;

use App\Bus\Contracts\CommandHandler;

final class UserNoteHandler implements CommandHandler
{
    public function handle(UserNoteCommand $command): int
    {
        return strlen($command->text);
    }
}
