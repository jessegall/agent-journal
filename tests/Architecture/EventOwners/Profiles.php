<?php

declare(strict_types=1);

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
use App\Profiles\Events\AccountUsageChanged;
use App\Profiles\Events\ProfileRevisionRevoked;
use App\Profiles\Events\SignInAttemptCleanupRetried;
use App\Profiles\Events\SignInAttemptFinished;
use App\Profiles\Events\SignInAttemptReleased;
use App\Profiles\Events\SignInAttemptStarted;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Profiles with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here. AccountsChanged is the projection of the row facts the Accounts page shows, and of
 * the challenge a host publishes, which writes a cache entry and no row.
 */
return [
    AccountsChanged::class => [
        'role' => EventRole::Projection,
        'migrated' => false,
        'producers' => [
            'app/Profiles/Handlers/PublishSignInChallengeHandler.php',
            'app/Profiles/Listeners/ProjectAccountsChanged.php',
        ],
    ],
    AccountCleaned::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Account::applyCleanup',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AccountCleaned('claude-code', 'account'),
    ],
    AccountCleanupRetried::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Account::retryCleanup',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AccountCleanupRetried('claude-code', 'account'),
    ],
    AccountHeldForMaintenance::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Account::holdForMaintenance',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AccountHeldForMaintenance('claude-code', 'account'),
    ],
    AccountNoticeRecorded::class => [
        'role' => EventRole::RowFact,
        'owner' => ['AccountNotice::create', 'AccountNotice::countAgain'],
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AccountNoticeRecorded('claude-code', 'notice'),
    ],
    AccountUsageChanged::class => [
        'role' => EventRole::RowFact,
        'owner' => [
            'AccountUsageCost::add',
            'AccountUsageTokens::create',
            'AccountUsageWindow::create',
            'KeepsNewestReading::saveReading',
        ],
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AccountUsageChanged('claude-code', 'account'),
    ],
    AccountNoticeResolved::class => [
        'role' => EventRole::RowFact,
        'owner' => 'AccountNotice::resolveAt',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AccountNoticeResolved('claude-code', 'notice'),
    ],
    AccountRemovalBegun::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Account::beginRemoval',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AccountRemovalBegun('claude-code', 'account'),
    ],
    AccountRenamed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Account::rename',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AccountRenamed('claude-code', 'account'),
    ],
    AccountSignedIn::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Account::signedInAgain',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AccountSignedIn('claude-code', 'account'),
    ],
    AccountSignedOut::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Account::applyCheck',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AccountSignedOut('claude-code', 'account'),
    ],
    AccountSwitched::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ActiveAccount::switchTo',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AccountSwitched('claude-code', 'account'),
    ],
    ProfileRevisionRevoked::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Profiles/Handlers/RevokeProfilesHandler.php',
        ],
    ],
    SignInAttemptCleanupRetried::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SignInAttempt::retryCleanup',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SignInAttemptCleanupRetried('claude-code', 'attempt'),
    ],
    SignInAttemptFinished::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SignInAttempt::finish',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SignInAttemptFinished('claude-code', 'attempt', 'account'),
    ],
    SignInAttemptReleased::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SignInAttempt::releaseForHost',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SignInAttemptReleased('claude-code', 'attempt', 'account'),
    ],
    SignInAttemptStarted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SignInAttempt::begin',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SignInAttemptStarted('claude-code', 'attempt', null),
    ],
];
