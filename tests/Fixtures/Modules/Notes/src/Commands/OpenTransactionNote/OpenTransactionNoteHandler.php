<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands\OpenTransactionNote;

use App\Bus\Contracts\CommandHandler;
use Illuminate\Database\ConnectionInterface;

final class OpenTransactionNoteHandler implements CommandHandler
{
    public function __construct(private readonly ConnectionInterface $database) {}

    public function handle(OpenTransactionNoteCommand $command): int
    {
        // Opens its own transaction, which the bus refuses: the sample of story 75.
        return (int) $this->database->transaction(
            fn () => $this->database->table('module_command_rows')->insertGetId(['text' => $command->text]),
        );
    }
}
