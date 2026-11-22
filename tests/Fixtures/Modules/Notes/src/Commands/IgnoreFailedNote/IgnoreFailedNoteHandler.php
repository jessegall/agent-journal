<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands\IgnoreFailedNote;

use App\Contracts\Bus\CommandBus;
use App\Exceptions\CommandRefused;
use App\Contracts\Bus\CommandHandler;
use Tests\Fixtures\Modules\Notes\Commands\IgnoreFailedNote\IgnoreFailedNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\RefuseNote\RefuseNoteCommand;

final class IgnoreFailedNoteHandler implements CommandHandler
{
    public function __construct(private readonly CommandBus $bus) {}

    public function handle(IgnoreFailedNoteCommand $command): int
    {
        try {
            return $this->bus->run(new RefuseNoteCommand($command->text));
        } catch (CommandRefused) {
            return 0;
        }
    }
}
