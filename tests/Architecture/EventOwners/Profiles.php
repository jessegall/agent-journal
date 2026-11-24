<?php

declare(strict_types=1);

use App\Enums\SignInState;
use App\Events\AccountCheckRequested;
use App\Events\AccountCleaned;
use App\Events\AccountCleanupReleased;
use App\Events\AccountCleanupRetried;
use App\Events\AccountHeldForMaintenance;
use App\Events\AccountNoticeRecorded;
use App\Events\AccountNoticeResolved;
use App\Events\AccountRecheckRequested;
use App\Events\AccountRemovalBegun;
use App\Events\AccountRemoved;
use App\Events\AccountRenamed;
use App\Events\AccountsChanged;
use App\Events\AccountSignedIn;
use App\Events\AccountSignedOut;
use App\Events\AccountSwitched;
use App\Events\AccountUsageChanged;
use App\Events\AccountWriterClaimed;
use App\Events\AccountWriterReleased;
use App\Events\ActiveAccountCleared;
use App\Events\ActiveAccountSelected;
use App\Events\ProfileRetired;
use App\Events\ProfileRevisionRevoked;
use App\Events\SignInAttemptAnswerAccepted;
use App\Events\SignInAttemptClaimed;
use App\Events\SignInAttemptCleanupApplied;
use App\Events\SignInAttemptCleanupRetried;
use App\Events\SignInAttemptDisplaced;
use App\Events\SignInAttemptEnded;
use App\Events\SignInAttemptFingerprinted;
use App\Events\SignInAttemptFinished;
use App\Events\SignInAttemptGenerationSet;
use App\Events\SignInAttemptReleased;
use App\Events\SignInAttemptStarted;
use App\Events\SignInAttemptWaitingForUser;
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
            'app/Commands/PublishSignInChallenge/PublishSignInChallengeHandler.php',
            'app/Listeners/ProjectAccountsChanged.php',
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
            'app/Commands/RevokeProfiles/RevokeProfilesHandler.php',
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
    SignInAttemptWaitingForUser::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SignInAttempt::waitForUser',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SignInAttemptWaitingForUser('claude-code', 'attempt'),
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
];
