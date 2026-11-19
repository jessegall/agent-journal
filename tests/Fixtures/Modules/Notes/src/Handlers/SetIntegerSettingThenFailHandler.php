<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Handlers;

use App\Bus\Contracts\CommandBus;
use App\Contracts\CommandHandler;
use App\Settings\Commands\SetIntegerSetting;
use Tests\Fixtures\Modules\Notes\Commands\SetIntegerSettingThenFail;
use Tests\Fixtures\Modules\Notes\Exceptions\NoteWorkFailed;

final class SetIntegerSettingThenFailHandler implements CommandHandler
{
    public function __construct(private readonly CommandBus $bus) {}

    public function handle(SetIntegerSettingThenFail $command): void
    {
        $this->bus->run(new SetIntegerSetting($command->setting, $command->value, $command->expectedRevision));

        throw NoteWorkFailed::afterNestedWork();
    }
}
