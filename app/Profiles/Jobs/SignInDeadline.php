<?php

declare(strict_types=1);

namespace App\Profiles\Jobs;

use App\Bus\Enums\CommandEntry;
use App\Bus\Support\EntryDispatchers;
use App\Profiles\Commands\ExpireSignInAttempt\ExpireSignInAttemptCommand;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

/**
 * Ends one sign-in at its deadline, holding nothing but the attempt's id; the minute sweep catches it if this job is
 * lost.
 */
final class SignInDeadline implements ShouldQueue
{
    use Dispatchable;
    use Queueable;

    public function __construct(public readonly string $attemptId) {}

    public function handle(EntryDispatchers $dispatchers): void
    {
        $dispatchers->runAsJournal(
            CommandEntry::AccountMaintenance,
            'sign-in deadline',
            new ExpireSignInAttemptCommand($this->attemptId),
        );
    }
}
