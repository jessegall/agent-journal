<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands\PinNote;

use App\Contracts\Bus\CommandHandler;
use Illuminate\Database\ConnectionInterface;
use Tests\Fixtures\Modules\Notes\Commands\PinNote\PinNoteCommand;

final class PinNoteHandler implements CommandHandler
{
    public function __construct(private readonly ConnectionInterface $database) {}

    public function handle(PinNoteCommand $command): string
    {
        return (string) $this->database->scalar('SHOW transaction_isolation');
    }
}
