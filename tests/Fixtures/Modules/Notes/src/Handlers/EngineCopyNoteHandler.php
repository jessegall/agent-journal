<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Handlers;

use App\Bus\Contracts\CommandBus;
use App\Contracts\CommandHandler;
use Tests\Fixtures\Modules\Notes\Commands\EngineCopyNote;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote;

final class EngineCopyNoteHandler implements CommandHandler
{
    public function __construct(private readonly CommandBus $bus) {}

    public function handle(EngineCopyNote $command): int
    {
        return $this->bus->run(new WriteNote($command->text));
    }
}
