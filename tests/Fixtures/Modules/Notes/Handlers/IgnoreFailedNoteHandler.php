<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Handlers;

use App\Core\Bus\Contracts\CommandBus;
use App\Core\Bus\Exceptions\CommandRefused;
use Tests\Fixtures\Modules\Notes\Commands\IgnoreFailedNote;
use Tests\Fixtures\Modules\Notes\Commands\RefuseNote;

final class IgnoreFailedNoteHandler
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
