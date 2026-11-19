<?php

declare(strict_types=1);

namespace App\Settings\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Settings\Handlers\SetStringSettingHandler;
use App\Settings\Values\SettingReference;
use App\Settings\Values\SettingsChange;

/**
 * Stores a text setting's value as the owner's next revision.
 *
 * @implements Command<SettingsChange>
 */
#[HandledBy(SetStringSettingHandler::class)]
final readonly class SetStringSetting implements Command
{
    public function __construct(
        public SettingReference $setting,
        public string $value,
        public int $expectedRevision,
    ) {}
}
