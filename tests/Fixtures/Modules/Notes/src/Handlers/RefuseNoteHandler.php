<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Handlers;

use App\Bus\Exceptions\CommandRefused;
use App\Contracts\CommandHandler;
use Illuminate\Database\ConnectionInterface;
use Tests\Fixtures\Modules\Notes\Commands\RefuseNote;

final class RefuseNoteHandler implements CommandHandler
{
    public function __construct(private readonly ConnectionInterface $database) {}

    public function handle(RefuseNote $command): int
    {
        $this->database->table('module_command_rows')->insert(['text' => $command->text]);

        throw CommandRefused::because('Notes are closed for now.');
    }
}
