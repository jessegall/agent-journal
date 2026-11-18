<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Handlers;

use App\Contracts\CommandHandler;
use Illuminate\Database\ConnectionInterface;
use Tests\Fixtures\Modules\Notes\Commands\KeepNote;

final class KeepNoteHandler implements CommandHandler
{
    public function __construct(private readonly ConnectionInterface $database) {}

    public function handle(KeepNote $command): int
    {
        return (int) $this->database->table('module_command_rows')->insertGetId(['text' => $command->text]);
    }
}
