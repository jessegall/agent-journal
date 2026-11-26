<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands\WriteNote;

use App\Bus\Contracts\CommandHandler;
use Illuminate\Database\ConnectionInterface;

final class WriteNoteHandler implements CommandHandler
{
    public function __construct(private readonly ConnectionInterface $database) {}

    public function handle(WriteNoteCommand $command): int
    {
        return (int) $this->database->table('module_command_rows')->insertGetId(['text' => $command->text]);
    }
}
