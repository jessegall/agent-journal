<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands\CopyLimitNote;

use App\Contracts\Bus\CommandBus;
use App\Contracts\Bus\CommandHandler;
use Tests\Fixtures\Modules\Notes\Commands\CopyLimitNote\CopyLimitNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\LimitNote\LimitNoteCommand;

final class CopyLimitNoteHandler implements CommandHandler
{
    public function __construct(private readonly CommandBus $bus) {}

    public function handle(CopyLimitNoteCommand $command): int
    {
        return $this->bus->run(new LimitNoteCommand($command->text));
    }
}
