<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands\EngineCopyNote;

use App\Contracts\Bus\CommandBus;
use App\Contracts\Bus\CommandHandler;
use Tests\Fixtures\Modules\Notes\Commands\EngineCopyNote\EngineCopyNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote\WriteNoteCommand;

final class EngineCopyNoteHandler implements CommandHandler
{
    public function __construct(private readonly CommandBus $bus) {}

    public function handle(EngineCopyNoteCommand $command): int
    {
        return $this->bus->run(new WriteNoteCommand($command->text));
    }
}
