<?php

declare(strict_types=1);

namespace App\Profiles\Listeners;

use App\Contracts\Listener;
use App\Profiles\Events\AccountCleaned;
use App\Profiles\Events\AccountCleanupRetried;
use App\Profiles\Events\AccountHeldForMaintenance;
use App\Profiles\Events\AccountNoticeRecorded;
use App\Profiles\Events\AccountNoticeResolved;
use App\Profiles\Events\AccountRemovalBegun;
use App\Profiles\Events\AccountRenamed;
use App\Profiles\Events\AccountsChanged;
use App\Profiles\Events\AccountSignedIn;
use App\Profiles\Events\AccountSignedOut;
use App\Profiles\Events\AccountSwitched;
use App\Profiles\Events\SignInAttemptCleanupRetried;
use App\Profiles\Events\SignInAttemptFinished;
use App\Profiles\Events\SignInAttemptReleased;
use App\Profiles\Events\SignInAttemptStarted;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Tells the owner's Accounts page to reread when a committed Profiles fact it shows arrives, naming the program and
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
        |SignInAttemptCleanupRetried
        |SignInAttemptFinished
        |SignInAttemptReleased
        |SignInAttemptStarted $fact,
    ): void {
        $this->events->dispatch(new AccountsChanged($fact->driver(), $fact->subjectId()));
    }
}
