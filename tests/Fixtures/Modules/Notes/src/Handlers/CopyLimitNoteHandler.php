<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Handlers;

use App\Bus\Contracts\CommandBus;
use App\Contracts\CommandHandler;
use Tests\Fixtures\Modules\Notes\Commands\CopyLimitNote;
use Tests\Fixtures\Modules\Notes\Commands\LimitNote;

final class CopyLimitNoteHandler implements CommandHandler
{
    public function __construct(private readonly CommandBus $bus) {}

    public function handle(CopyLimitNote $command): int
    {
        return $this->bus->run(new LimitNote($command->text));
    }
}
