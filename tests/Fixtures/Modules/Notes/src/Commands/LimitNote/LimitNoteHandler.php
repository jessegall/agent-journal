<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands\LimitNote;

use App\Contracts\Bus\CommandHandler;
use Illuminate\Database\ConnectionInterface;
use Tests\Fixtures\Modules\Notes\Commands\LimitNote\LimitNoteCommand;

final class LimitNoteHandler implements CommandHandler
{
    public function __construct(private readonly ConnectionInterface $database) {}

    public function handle(LimitNoteCommand $command): int
    {
        return (int) $this->database->table('module_command_rows')->insertGetId(['text' => $command->text]);
    }
}
