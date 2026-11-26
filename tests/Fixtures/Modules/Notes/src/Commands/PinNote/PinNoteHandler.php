<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands\PinNote;

use App\Bus\Contracts\CommandHandler;
use Illuminate\Database\ConnectionInterface;

final class PinNoteHandler implements CommandHandler
{
    public function __construct(private readonly ConnectionInterface $database) {}

    public function handle(PinNoteCommand $command): string
    {
        return (string) $this->database->scalar('SHOW transaction_isolation');
    }
}
