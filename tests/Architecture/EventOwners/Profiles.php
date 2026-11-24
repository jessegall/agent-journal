<?php

declare(strict_types=1);

use App\Enums\ProfileRunState;
use App\Enums\SignInState;
use App\Events\Accounts\AccountCheckRequested;
use App\Events\Accounts\AccountCleaned;
use App\Events\Accounts\AccountCleanupReleased;
use App\Events\Accounts\AccountCleanupRetried;
use App\Events\Accounts\AccountHeldForMaintenance;
use App\Events\Accounts\AccountNoticeRecorded;
use App\Events\Accounts\AccountNoticeResolved;
use App\Events\Accounts\AccountRecheckRequested;
use App\Events\Accounts\AccountRemovalStarted;
use App\Events\Accounts\AccountRemoved;
use App\Events\Accounts\AccountRenamed;
use App\Events\Accounts\AccountsChanged;
use App\Events\Accounts\AccountSignedIn;
use App\Events\Accounts\AccountSignedOut;
use App\Events\Accounts\AccountSwitched;
use App\Events\Accounts\AccountUsageChanged;
use App\Events\Accounts\AccountWriterClaimed;
use App\Events\Accounts\AccountWriterReleased;
use App\Events\Accounts\ActiveAccountCleared;
use App\Events\Accounts\ActiveAccountSelected;
use App\Events\Accounts\ProfileRetired;
use App\Events\Accounts\ProfileRevisionRevoked;
use App\Events\Accounts\ProfileRunFinished;
use App\Events\Accounts\ProfileRunResumed;
use App\Events\Accounts\ProfileRunStarted;
use App\Events\Accounts\ProfileRunSuspended;
use App\Events\Accounts\SignInAttemptAnswerAccepted;
use App\Events\Accounts\SignInAttemptClaimed;
use App\Events\Accounts\SignInAttemptCleanupApplied;
use App\Events\Accounts\SignInAttemptCleanupRetried;
use App\Events\Accounts\SignInAttemptDisplaced;
use App\Events\Accounts\SignInAttemptEnded;
use App\Events\Accounts\SignInAttemptFingerprinted;
use App\Events\Accounts\SignInAttemptFinished;
use App\Events\Accounts\SignInAttemptGenerationSet;
use App\Events\Accounts\SignInAttemptHandedToUser;
use App\Events\Accounts\SignInAttemptReleased;
use App\Events\Accounts\SignInAttemptStarted;
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
            'app/Commands/Accounts/PublishSignInChallenge/PublishSignInChallengeHandler.php',
            'app/Listeners/NotifyAccountsPage.php',
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
    AccountRemovalStarted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Account::beginRemoval',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AccountRemovalStarted('claude-code', 'account'),
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
            'app/Commands/Profiles/RevokeProfiles/RevokeProfilesHandler.php',
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
    AccountRecheckRequested::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Account::recheck',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AccountRecheckRequested('claude-code', 'account'),
    ],
    AccountCheckRequested::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Account::requestCheck',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AccountCheckRequested('claude-code', 'account', 1),
    ],
    AccountWriterClaimed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Account::writerFor',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AccountWriterClaimed('claude-code', 'account', 'attempt'),
    ],
    AccountWriterReleased::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Account::releaseWriter',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AccountWriterReleased('claude-code', 'account', 'attempt'),
    ],
    AccountCleanupReleased::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Account::releaseCleanup',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AccountCleanupReleased('claude-code', 'account'),
    ],
    AccountRemoved::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Account::finishRemoval',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AccountRemoved('claude-code', 'account'),
    ],
    ActiveAccountSelected::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ActiveAccount::select',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ActiveAccountSelected('claude-code', 'account'),
    ],
    ActiveAccountCleared::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ActiveAccount::clear',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ActiveAccountCleared('claude-code'),
    ],
    SignInAttemptDisplaced::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SignInAttempt::displace',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SignInAttemptDisplaced('claude-code', 'attempt', 'account'),
    ],
    SignInAttemptFingerprinted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SignInAttempt::keepFingerprint',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SignInAttemptFingerprinted('claude-code', 'attempt'),
    ],
    SignInAttemptEnded::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SignInAttempt::end',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SignInAttemptEnded('claude-code', 'attempt', SignInState::Complete),
    ],
    SignInAttemptHandedToUser::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SignInAttempt::waitForUser',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SignInAttemptHandedToUser('claude-code', 'attempt'),
    ],
    SignInAttemptAnswerAccepted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SignInAttempt::acceptAnswer',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SignInAttemptAnswerAccepted('claude-code', 'attempt'),
    ],
    SignInAttemptClaimed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SignInAttempt::claimOn',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SignInAttemptClaimed('claude-code', 'attempt', 'host'),
    ],
    SignInAttemptGenerationSet::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SignInAttempt::writeInGeneration',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SignInAttemptGenerationSet('claude-code', 'attempt', 1),
    ],
    SignInAttemptCleanupApplied::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SignInAttempt::applyCleanup',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SignInAttemptCleanupApplied('claude-code', 'attempt', true),
    ],
    ProfileRetired::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Profile::retire',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProfileRetired('profile'),
    ],
    ProfileRunStarted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProfileRun::startOn',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProfileRunStarted('run', 1),
    ],
    ProfileRunSuspended::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProfileRun::suspendOn',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProfileRunSuspended('run', 1),
    ],
    ProfileRunResumed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProfileRun::resumeAfter',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProfileRunResumed('run'),
    ],
    ProfileRunFinished::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProfileRun::finish',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProfileRunFinished('run', ProfileRunState::cases()[0]),
    ],
];
