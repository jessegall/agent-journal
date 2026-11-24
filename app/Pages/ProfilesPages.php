<?php

declare(strict_types=1);

namespace App\Pages;

use App\Contracts\Drivers\NativePartProvider;
use App\Contracts\Navigation\NavigationProvider;
use App\Contracts\Navigation\PageProvider;
use App\Contracts\Navigation\SectionProvider;
use App\Contracts\Records\TypeProvider;
use App\Data\Accounts\AccountListData;
use App\Data\Accounts\AccountMonthCostData;
use App\Data\Accounts\AccountNoticeData;
use App\Data\Accounts\AccountNoticesData;
use App\Data\Accounts\AccountRowData;
use App\Data\Accounts\AccountSelectionData;
use App\Data\Accounts\AccountStartData;
use App\Data\Accounts\AccountThreadTokensData;
use App\Data\Accounts\AccountUsageData;
use App\Data\Accounts\AccountUsageWindowData;
use App\Data\Accounts\DriverMethodsData;
use App\Data\Accounts\EligibleAccountData;
use App\Data\Accounts\EligibleAccountsData;
use App\Data\Accounts\PendingAttemptCleanupData;
use App\Data\Accounts\SignInAttemptData;
use App\Data\Accounts\SignInMethodData;
use App\Data\Accounts\SignInReceiptData;
use App\Data\Accounts\StartAccountData;
use App\Data\Profiles\ScriptDiagnostic;
use App\Declarations\ActionRoute;
use App\Declarations\DomainUi;
use App\Declarations\NavigationItem;
use App\Declarations\Page;
use App\Declarations\Section;
use App\Enums\AccountCheckResult;
use App\Enums\AccountNoticeReason;
use App\Enums\AccountState;
use App\Enums\AuthorizationType;
use App\Enums\CleanupProblem;
use App\Enums\CleanupTarget;
use App\Enums\CommandDirectory;
use App\Enums\Icon;
use App\Enums\InstancePolicy;
use App\Enums\PolicyOriginType;
use App\Enums\ProfileChangeType;
use App\Enums\SignInMethod;
use App\Enums\SignInOutcome;
use App\Enums\SignInReceiptStatus;
use App\Enums\SignInRefusal;
use App\Enums\SignInState;
use App\Enums\SignInType;
use App\Enums\SlotContextType;
use App\Enums\SupervisorCoverageType;
use App\Enums\UsageWindowSlot;
use App\Http\Controllers\ActivateAccountController;
use App\Http\Controllers\CancelSignInController;
use App\Http\Controllers\DismissAccountNoticeController;
use App\Http\Controllers\RecheckAccountController;
use App\Http\Controllers\RemoveAccountController;
use App\Http\Controllers\RenameAccountController;
use App\Http\Controllers\RetryAccountCleanupController;
use App\Http\Controllers\RetryAttemptCleanupController;
use App\Http\Controllers\SignInAgainController;
use App\Http\Controllers\SignInChallengeController;
use App\Http\Controllers\SignInReceiptController;
use App\Http\Controllers\StartSignInController;
use App\Http\Controllers\SubmitSignInCodeController;
use App\Http\Pages\Resolvers\AccountNoticesSection;
use App\Http\Pages\Resolvers\AccountsWindowResolver;
use App\Http\Pages\Resolvers\ProfilesWindowResolver;
use App\Http\Pages\Resolvers\ProfileWindowResolver;
use App\Http\Pages\Resolvers\StartAccountWindowResolver;
use App\Support\AccountOwnerCheck;

/**
 * The pages Core's Profiles declares, for the owner alone, under /accounts: the saved Claude Code and Codex accounts,
 * with choosing the one each driver starts with and renaming one.
 */
final class ProfilesPages implements NativePartProvider, NavigationProvider, PageProvider, SectionProvider, TypeProvider
{
    /**
     * The native parts the Accounts layout mounts: the account list with its setup, sign-in and recovery, and the
     * add-account wizard its Add account action opens.
     *
     * @return list<string>
     */
    public function nativeParts(): array
    {
        return ['AccountsWindow.vue', 'AddAccountPart.vue'];
    }

    public function pages(): array
    {
        return [
            Page::layout('accounts', 'Accounts', Icon::Accounts, AccountsWindowResolver::class)
                ->at('')
                ->visibleWhen(AccountOwnerCheck::class)
                ->actions(
                    ActionRoute::post('{account}/activate', ActivateAccountController::class, 'activate'),
                    ActionRoute::patch('{account}', RenameAccountController::class, 'rename'),
                    ActionRoute::post('sign-ins', StartSignInController::class, 'start-sign-in'),
                    ActionRoute::get('sign-ins/receipt', SignInReceiptController::class, 'sign-in-receipt'),
                    ActionRoute::post('{account}/sign-in-again', SignInAgainController::class, 'sign-in-again'),
                    ActionRoute::delete('{account}', RemoveAccountController::class, 'remove'),
                    ActionRoute::post('{account}/cleanup/retry', RetryAccountCleanupController::class, 'retry-cleanup'),
                    ActionRoute::post('{account}/recheck', RecheckAccountController::class, 'recheck'),
                    ActionRoute::post(
                        'sign-ins/{attempt}/cleanup/retry',
                        RetryAttemptCleanupController::class,
                        'retry-sign-in-cleanup',
                    ),
                    ActionRoute::post('notices/{notice}/dismiss', DismissAccountNoticeController::class, 'dismiss'),
                    ActionRoute::post('sign-ins/{attempt}/challenge', SignInChallengeController::class, 'challenge'),
                    ActionRoute::post('sign-ins/{attempt}/code', SubmitSignInCodeController::class, 'submit-code'),
                    ActionRoute::post('sign-ins/{attempt}/cancel', CancelSignInController::class, 'cancel-sign-in'),
                ),
            Page::layout('profiles', 'Profiles', Icon::Accounts, ProfilesWindowResolver::class)
                ->at('profiles')
                ->visibleWhen(AccountOwnerCheck::class),
            Page::layout('profile', 'Profile', Icon::Accounts, ProfileWindowResolver::class)
                ->at('profiles/{profile}')
                ->visibleWhen(AccountOwnerCheck::class),
            Page::make(
                'account-start',
                'Account of a start',
                Icon::Accounts,
                StartAccountWindowResolver::class,
                'StartAccountWindow.vue',
            )
                ->at('starts/{session}')
                ->visibleWhen(AccountOwnerCheck::class),
        ];
    }

    public function sections(): array
    {
        return [
            Section::make(
                'notices',
                'Account notices',
                'web.bar',
                SlotContextType::Nothing,
                AccountNoticesSection::class,
                'AccountNotices.vue',
            ),
        ];
    }

    public function navigation(): array
    {
        return [
            NavigationItem::page('profiles', 'Profiles', Icon::Profiles, position: 50),
            NavigationItem::page('accounts', 'Accounts', Icon::Accounts, position: 60),
        ];
    }

    /**
     * The data classes and enums these pages own, generated in the accounts module.
     */
    public function types(): array
    {
        return [
            AccountListData::class,
            AccountMonthCostData::class,
            AccountNoticeData::class,
            AccountNoticesData::class,
            AccountRowData::class,
            AccountSelectionData::class,
            AccountStartData::class,
            AccountThreadTokensData::class,
            AccountUsageData::class,
            AccountUsageWindowData::class,
            DriverMethodsData::class,
            EligibleAccountData::class,
            EligibleAccountsData::class,
            PendingAttemptCleanupData::class,
            SignInAttemptData::class,
            SignInMethodData::class,
            SignInReceiptData::class,
            StartAccountData::class,
            ScriptDiagnostic::class,
            AccountCheckResult::class,
            AccountNoticeReason::class,
            AccountState::class,
            AuthorizationType::class,
            CleanupProblem::class,
            CleanupTarget::class,
            CommandDirectory::class,
            InstancePolicy::class,
            PolicyOriginType::class,
            ProfileChangeType::class,
            SignInMethod::class,
            SignInOutcome::class,
            SignInReceiptStatus::class,
            SignInRefusal::class,
            SignInState::class,
            SignInType::class,
            SupervisorCoverageType::class,
            UsageWindowSlot::class,
        ];
    }

    /**
     * The account pages under their own key, accounts, as checked with the domains' declarations.
     */
    public function declarations(): DomainUi
    {
        return DomainUi::ofCore($this, 'Accounts', 'profiles');
    }
}
