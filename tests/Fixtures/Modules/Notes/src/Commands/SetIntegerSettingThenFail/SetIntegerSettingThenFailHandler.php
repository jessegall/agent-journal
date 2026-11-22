<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands\SetIntegerSettingThenFail;

use App\Contracts\Bus\CommandBus;
use App\Contracts\Bus\CommandHandler;
use App\Commands\SetIntegerSetting\SetIntegerSettingCommand;
use Tests\Fixtures\Modules\Notes\Commands\SetIntegerSettingThenFail\SetIntegerSettingThenFailCommand;
use Tests\Fixtures\Modules\Notes\Exceptions\NoteWorkFailed;

final class SetIntegerSettingThenFailHandler implements CommandHandler
{
    public function __construct(private readonly CommandBus $bus) {}

    public function handle(SetIntegerSettingThenFailCommand $command): void
    {
        $this->bus->run(new SetIntegerSettingCommand($command->setting, $command->value, $command->expectedRevision));

        throw NoteWorkFailed::afterNestedWork();
    }
}
