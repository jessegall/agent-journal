<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Listener;
use App\Events\AccountCleaned;
use App\Events\AccountCleanupRetried;
use App\Events\AccountHeldForMaintenance;
use App\Events\AccountNoticeRecorded;
use App\Events\AccountNoticeResolved;
use App\Events\AccountRemovalBegun;
use App\Events\AccountRenamed;
use App\Events\AccountsChanged;
use App\Events\AccountSignedIn;
use App\Events\AccountSignedOut;
use App\Events\AccountSwitched;
use App\Events\AccountUsageChanged;
use App\Events\SignInAttemptCleanupRetried;
use App\Events\SignInAttemptFinished;
use App\Events\SignInAttemptReleased;
use App\Events\SignInAttemptStarted;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Tells the owner's Accounts page to reread when a committed Profiles fact it shows arrives, naming the driver and
 * the account, attempt or notice the fact is about.
 */
final readonly class ProjectAccountsChanged implements Listener
{
    public function __construct(private Dispatcher $events) {}

    public function handle(
        AccountCleaned
        |AccountCleanupRetried
        |AccountHeldForMaintenance
        |AccountNoticeRecorded
        |AccountNoticeResolved
        |AccountRemovalBegun
        |AccountRenamed
        |AccountSignedIn
        |AccountSignedOut
        |AccountSwitched
        |AccountUsageChanged
        |SignInAttemptCleanupRetried
        |SignInAttemptFinished
        |SignInAttemptReleased
        |SignInAttemptStarted $fact,
    ): void {
        $this->events->dispatch(new AccountsChanged($fact->driver(), $fact->subjectId()));
    }
}
