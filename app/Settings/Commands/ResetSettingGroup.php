<?php

declare(strict_types=1);

namespace App\Settings\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Settings\Handlers\ResetSettingGroupHandler;
use App\Settings\Values\GroupReference;
use App\Settings\Values\SettingsChange;

/**
 * Removes a group's stored switch so it follows its declared default again, keeping its settings' values.
 *
 * @implements Command<SettingsChange>
 */
#[HandledBy(ResetSettingGroupHandler::class)]
final readonly class ResetSettingGroup implements Command
{
    public function __construct(
        public GroupReference $group,
        public int $expectedRevision,
    ) {}
}
