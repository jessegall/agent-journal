<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Accounts\Enums\CommandEntry;
use App\Agents\Commands\ProbeClaimedStart\ProbeClaimedStartCommand;
use App\Bus\Contracts\JournalCommands;
use App\Contracts\Events\Listener;
use App\Hosts\Contracts\DriverImageOutcome;
use App\Models\Projects\HostDriverImage;
use App\Models\Projects\HostDriverImageWait;

/**
 * A driver image that settled, ready or refused, takes each start that waited on it to its probe again: a ready image
 * probes the start in it, a refused one ends the start with the image's refusal.
 */
final readonly class ProbeStartsWaitingOnDriverImage implements Listener
{
    private const string TRUSTED_ENTRY = 'headless starts';

    public function __construct(private JournalCommands $commands) {}

    public function handle(DriverImageOutcome $fact): void
    {
        $image = HostDriverImage::query()->findOrFail($fact->hostDriverImageId);

        foreach (HostDriverImageWait::query()->of($image)->pluck('session_process_id') as $startId) {
            $probe = new ProbeClaimedStartCommand((string) $startId);
            $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $probe);
        }
    }
}
