<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Handlers;

use App\Bus\Contracts\CommandBus;
use App\Bus\Exceptions\CommandRefused;
use App\Contracts\CommandHandler;
use Tests\Fixtures\Modules\Notes\Commands\IgnoreFailedNote;
use Tests\Fixtures\Modules\Notes\Commands\RefuseNote;

final class IgnoreFailedNoteHandler implements CommandHandler
{
    public function __construct(private readonly CommandBus $bus) {}

    public function handle(IgnoreFailedNote $command): int
    {
        try {
            return $this->bus->run(new RefuseNote($command->text));
        } catch (CommandRefused) {
            return 0;
        }
    }
}
