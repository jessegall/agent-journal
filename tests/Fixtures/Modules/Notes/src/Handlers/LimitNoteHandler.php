<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Handlers;

use App\Contracts\CommandHandler;
use Illuminate\Database\ConnectionInterface;
use Tests\Fixtures\Modules\Notes\Commands\LimitNote;

final class LimitNoteHandler implements CommandHandler
{
    public function __construct(private readonly ConnectionInterface $database) {}

    public function handle(LimitNote $command): int
    {
        return (int) $this->database->table('module_command_rows')->insertGetId(['text' => $command->text]);
    }
}
