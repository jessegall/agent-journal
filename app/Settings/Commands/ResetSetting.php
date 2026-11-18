<?php

declare(strict_types=1);

namespace App\Settings\Commands;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;
use App\Settings\Handlers\ResetSettingHandler;
use App\Settings\Values\SettingReference;
use App\Settings\Values\SettingsChange;

/**
 * Removes a setting's override so it follows its declared default again.
 *
 * @implements Command<SettingsChange>
 */
#[HandledBy(ResetSettingHandler::class)]
#[RequiresActor(ActorType::User)]
final readonly class ResetSetting implements Command
{
    public function __construct(
        public SettingReference $setting,
        public int $expectedRevision,
    ) {}
}
