<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Handlers;

use Tests\Fixtures\Modules\Notes\Commands\UserNote;

final class UserNoteHandler
{
    public function handle(UserNote $command): int
    {
        return strlen($command->text);
    }
}
