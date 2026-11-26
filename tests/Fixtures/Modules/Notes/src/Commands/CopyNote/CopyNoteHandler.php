<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands\CopyNote;

use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\CommandHandler;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote\WriteNoteCommand;

final class CopyNoteHandler implements CommandHandler
{
    public function __construct(private readonly CommandBus $bus) {}

    public function handle(CopyNoteCommand $command): int
    {
        return $this->bus->run(new WriteNoteCommand($command->text));
    }
}
