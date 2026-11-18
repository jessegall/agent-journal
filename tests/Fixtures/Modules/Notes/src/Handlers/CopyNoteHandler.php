<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Handlers;

use App\Bus\Contracts\CommandBus;
use Tests\Fixtures\Modules\Notes\Commands\CopyNote;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote;

final class CopyNoteHandler
{
    public function __construct(private readonly CommandBus $bus) {}

    public function handle(CopyNote $command): int
    {
        return $this->bus->run(new WriteNote($command->text));
    }
}
