<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands\RefuseNote;

use App\Bus\Contracts\CommandHandler;
use App\Bus\Exceptions\CommandRefused;
use Illuminate\Database\ConnectionInterface;

final class RefuseNoteHandler implements CommandHandler
{
    public function __construct(private readonly ConnectionInterface $database) {}

    public function handle(RefuseNoteCommand $command): int
    {
        $this->database->table('module_command_rows')->insert(['text' => $command->text]);

        throw CommandRefused::because('Notes are closed for now.');
    }
}
