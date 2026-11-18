<?php

declare(strict_types=1);

namespace App\Settings\Commands;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;
use App\Settings\Handlers\SetBooleanSettingHandler;
use App\Settings\Values\SettingReference;
use App\Settings\Values\SettingsChange;

/**
 * Stores an on-or-off setting's value as the owner's next revision.
 *
 * @implements Command<SettingsChange>
 */
#[HandledBy(SetBooleanSettingHandler::class)]
#[RequiresActor(ActorType::User)]
final readonly class SetBooleanSetting implements Command
{
    public function __construct(
        public SettingReference $setting,
        public bool $value,
        public int $expectedRevision,
    ) {}
}
