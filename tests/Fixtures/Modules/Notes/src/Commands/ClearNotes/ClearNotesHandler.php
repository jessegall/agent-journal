<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands\ClearNotes;

use App\Contracts\CommandHandler;
use Illuminate\Database\ConnectionInterface;
use Tests\Fixtures\Modules\Notes\Commands\ClearNotes\ClearNotesCommand;

final class ClearNotesHandler implements CommandHandler
{
    public function __construct(private readonly ConnectionInterface $database) {}

    public function handle(ClearNotesCommand $command): void
    {
        $this->database->table('module_command_rows')->delete();
    }
}
