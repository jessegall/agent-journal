<?php

declare(strict_types=1);

namespace App\Settings\Commands;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;
use App\Settings\Handlers\DisableSettingGroupHandler;
use App\Settings\Values\GroupReference;
use App\Settings\Values\SettingsChange;

/**
 * Switches off a group that can be switched off, keeping its settings' values.
 *
 * @implements Command<SettingsChange>
 */
#[HandledBy(DisableSettingGroupHandler::class)]
#[RequiresActor(ActorType::User)]
final readonly class DisableSettingGroup implements Command
{
    public function __construct(
        public GroupReference $group,
        public int $expectedRevision,
    ) {}
}
