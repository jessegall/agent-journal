<?php

declare(strict_types=1);

use App\Profiles\Events\AccountsChanged;
use App\Profiles\Events\ProfileRevisionRevoked;
use App\Profiles\Events\SignInAttemptFinished;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Profiles with their role, owning transition and the files that send them today (doc 70, table 1).
 * Each migration slice sets migrated, names a sample, and leaves its owner the one producer; EventProducerTest fails
 * on any producer not listed here.
 */
return [
    AccountsChanged::class => [
        'role' => EventRole::Projection,
        'migrated' => false,
        'producers' => [
            'app/Profiles/Handlers/BeginSignInAgainHandler.php',
            'app/Profiles/Handlers/BeginSignInHandler.php',
            'app/Profiles/Handlers/CancelSignInHandler.php',
            'app/Profiles/Handlers/CheckAccountHandler.php',
            'app/Profiles/Handlers/CleanAccountHandler.php',
            'app/Profiles/Handlers/DismissAccountNoticeHandler.php',
            'app/Profiles/Handlers/ExpireSignInAttemptHandler.php',
            'app/Profiles/Handlers/MaintainAccountHandler.php',
            'app/Profiles/Handlers/PublishSignInChallengeHandler.php',
            'app/Profiles/Handlers/ReconcileSignInsHandler.php',
            'app/Profiles/Handlers/ReleaseSignInAgainHandler.php',
            'app/Profiles/Handlers/RemoveAccountHandler.php',
            'app/Profiles/Handlers/RenameAccountHandler.php',
            'app/Profiles/Handlers/ReportSignInHandler.php',
            'app/Profiles/Handlers/RetryAccountCleanupHandler.php',
            'app/Profiles/Handlers/RetryAttemptCleanupHandler.php',
            'app/Profiles/Handlers/SwitchAccountHandler.php',
            'app/Profiles/Listeners/ShowAccountsNotice.php',
            'app/Profiles/Support/SignInCompletion.php',
        ],
    ],
    ProfileRevisionRevoked::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Profile::retire',
        'migrated' => false,
        'producers' => [
            'app/Profiles/Handlers/RevokeProfilesHandler.php',
        ],
    ],
    SignInAttemptFinished::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SignInAttempt::finish',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SignInAttemptFinished('attempt', 'account'),
    ],
];
