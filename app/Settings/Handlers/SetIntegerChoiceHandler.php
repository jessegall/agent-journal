<?php

declare(strict_types=1);

namespace App\Settings\Handlers;

use App\Actors\Contracts\CurrentAuthorizer;
use App\Contracts\CommandHandler;
use App\Settings\Commands\SetIntegerChoice;
use App\Settings\Enums\SettingAbility;
use App\Settings\Models\SettingsRecord;
use App\Settings\Policies\SettingPolicy;
use App\Settings\Support\OptionChanges;
use App\Settings\Values\SettingsChange;

/**
 * Stores the chosen option of a choice or backed enum setting that holds whole numbers.
 */
final readonly class SetIntegerChoiceHandler implements CommandHandler
{
    public function __construct(private CurrentAuthorizer $administration, private OptionChanges $options) {}

    public function handle(SetIntegerChoice $command): SettingsChange
    {
        $this->administration->authorize(SettingPolicy::class, SettingsRecord::class, SettingAbility::Administer);

        return $this->options->choose($command->setting, $command->value, $command->expectedRevision);
    }
}
