<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands\RetainNote;

use App\Contracts\Bus\CommandHandler;
use Illuminate\Database\ConnectionInterface;
use Tests\Fixtures\Modules\Notes\Commands\RetainNote\RetainNoteCommand;

final class RetainNoteHandler implements CommandHandler
{
    public function __construct(private readonly ConnectionInterface $database) {}

    public function handle(RetainNoteCommand $command): int
    {
        return (int) $this->database->table('module_command_rows')->insertGetId(['text' => $command->text]);
    }
}
