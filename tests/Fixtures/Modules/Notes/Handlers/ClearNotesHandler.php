<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Handlers;

use Illuminate\Database\ConnectionInterface;
use Tests\Fixtures\Modules\Notes\Commands\ClearNotes;

final class ClearNotesHandler
{
    public function __construct(private readonly ConnectionInterface $database) {}

    public function handle(ClearNotes $command): void
    {
        $this->database->table('module_command_rows')->delete();
    }
}
