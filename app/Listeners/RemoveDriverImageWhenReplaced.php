<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Accounts\Enums\CommandEntry;
use App\Bus\Contracts\JournalCommands;
use App\Contracts\Events\Listener;
use App\Events\Connections\DriverImageReplaced;
use App\Hosts\Commands\RemoveHostImage\RemoveHostImageCommand;

/**
 * A dropped driver image is removed from its host's Docker daemon after the drop commits, so old images never pile up
 * on a host; the image a live session still runs is never dropped, so it is never removed here.
 */
final readonly class RemoveDriverImageWhenReplaced implements Listener
{
    private const string TRUSTED_ENTRY = 'removing a replaced driver image';

    public function __construct(private JournalCommands $commands) {}

    public function handle(DriverImageReplaced $replaced): void
    {
        $this->commands->runAsJournal(
            CommandEntry::HostControl,
            self::TRUSTED_ENTRY,
            new RemoveHostImageCommand($replaced->hostId, $replaced->image),
        );
    }
}
