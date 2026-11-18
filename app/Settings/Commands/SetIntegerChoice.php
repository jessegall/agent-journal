<?php

declare(strict_types=1);

namespace App\Settings\Commands;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;
use App\Settings\Handlers\SetIntegerChoiceHandler;
use App\Settings\Values\SettingReference;
use App\Settings\Values\SettingsChange;

/**
 * Stores the chosen whole-number option of a choice or int-backed enum setting as the owner's next revision.
 *
 * @implements Command<SettingsChange>
 */
#[HandledBy(SetIntegerChoiceHandler::class)]
#[RequiresActor(ActorType::User)]
final readonly class SetIntegerChoice implements Command
{
    public function __construct(
        public SettingReference $setting,
        public int $value,
        public int $expectedRevision,
    ) {}
}
