<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands\SystemNote;

use App\Bus\Contracts\CommandHandler;

final class SystemNoteHandler implements CommandHandler
{
    public function handle(SystemNoteCommand $command): int
    {
        return strlen($command->text);
    }
}
