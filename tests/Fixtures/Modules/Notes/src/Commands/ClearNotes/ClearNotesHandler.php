<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands\ClearNotes;

use App\Bus\Contracts\CommandHandler;
use Illuminate\Database\ConnectionInterface;

final class ClearNotesHandler implements CommandHandler
{
    public function __construct(private readonly ConnectionInterface $database) {}

    public function handle(ClearNotesCommand $command): void
    {
        $this->database->table('module_command_rows')->delete();
    }
}
