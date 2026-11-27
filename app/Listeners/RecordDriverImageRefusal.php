<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Accounts\Enums\CommandEntry;
use App\Bus\JournalCommands;
use App\Contracts\Events\Listener;
use App\Events\Connections\HostInstructionRefused;
use App\Hosts\Commands\RecordDriverImageRefusal\RecordDriverImageRefusalCommand;
use App\Hosts\Protocol\HostInstructionType;

/**
 * A host's refusal of a build, an allow set or start checks moves the driver images that waited on it.
 */
final readonly class RecordDriverImageRefusal implements Listener
{
    private const string TRUSTED_ENTRY = 'host driver images';

    private const array IMAGE_INSTRUCTIONS = [
        HostInstructionType::BuildImage,
        HostInstructionType::AllowImages,
        HostInstructionType::RunContainers,
    ];

    public function __construct(private JournalCommands $commands) {}

    public function handle(HostInstructionRefused $fact): void
    {
        if (! in_array($fact->type, self::IMAGE_INSTRUCTIONS, true)) {
            return;
        }

        $record = new RecordDriverImageRefusalCommand($fact->instructionId);
        $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $record);
    }
}
