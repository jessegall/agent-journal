<?php

declare(strict_types=1);

namespace App\Commands\Settings\SetIntegerChoice;

use App\Contracts\Bus\CommandHandler;
use App\Support\OptionChanges;
use App\Values\SettingsChange;

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
