<?php

declare(strict_types=1);

namespace App\Settings\Commands\SetIntegerChoice;

use App\Bus\Contracts\CommandHandler;
use App\Settings\OptionChanges;
use App\Settings\Values\SettingsChange;

/**
 * Stores the chosen option of a choice or backed enum setting that holds whole numbers.
 */
final readonly class SetIntegerChoiceHandler implements CommandHandler
{
    public function __construct(private OptionChanges $options) {}

    public function handle(SetIntegerChoiceCommand $command): SettingsChange
    {

        return $this->options->choose($command->setting, $command->selectedKey, $command->expectedRevision);
    }
}
