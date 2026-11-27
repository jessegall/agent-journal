<?php

declare(strict_types=1);

namespace App\Pages;

use App\Accounts\AccountOwnerCheck;
use App\Accounts\Data\AccountListData;
use App\Accounts\Data\AccountMonthCostData;
use App\Accounts\Data\AccountNoticeData;
use App\Accounts\Data\AccountNoticesData;
use App\Accounts\Data\AccountRowData;
use App\Accounts\Data\AccountSelectionData;
use App\Accounts\Data\AccountStartData;
use App\Accounts\Data\AccountThreadTokensData;
use App\Accounts\Data\AccountUsageData;
use App\Accounts\Data\AccountUsageWindowData;
use App\Accounts\Data\DriverMethodsData;
use App\Accounts\Data\EligibleAccountData;
use App\Accounts\Data\EligibleAccountsData;
use App\Accounts\Data\PendingAttemptCleanupData;
use App\Accounts\Data\SignInAttemptData;
use App\Accounts\Data\SignInMethodData;
use App\Accounts\Data\SignInReceiptData;
use App\Accounts\Data\StartAccountData;
use App\Accounts\Enums\AccountCheckResult;
use App\Accounts\Enums\AccountNoticeReason;
use App\Accounts\Enums\AccountStatus;
use App\Accounts\Enums\CleanupProblem;
use App\Accounts\Enums\CleanupTarget;
use App\Accounts\Enums\SignInMethod;
use App\Accounts\Enums\SignInOutcome;
use App\Accounts\Enums\SignInReceiptStatus;
use App\Accounts\Enums\SignInRefusal;
use App\Accounts\Enums\SignInStatus;
use App\Accounts\Enums\SignInType;
use App\Accounts\Enums\UsageWindowSlot;
use App\Agents\Drivers\Contracts\NativePartProvider;
use App\Asks\Enums\SupervisorCoverageType;
use App\Declarations\Page;
use App\Declarations\PageActions;
use App\Declarations\PageLoaders;
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
use App\Http\Controllers\StartSignInController;
use App\Http\Controllers\SubmitSignInCodeController;
use App\Http\Loaders\Profiles\SignInReceiptLoader;
use App\Http\Pages\Resolvers\AccountNoticesSection;
use App\Http\Pages\Resolvers\AccountsWindowResolver;
use App\Http\Pages\Resolvers\ProfilesWindowResolver;
use App\Http\Pages\Resolvers\ProfileWindowResolver;
use App\Http\Pages\Resolvers\StartAccountWindowResolver;
use App\Navigation\Contracts\NavigationProvider;
use App\Navigation\Contracts\PageProvider;
use App\Navigation\Contracts\SectionProvider;
use App\Navigation\Declarations\DomainClient;
use App\Navigation\Declarations\NavigationItem;
use App\Navigation\Enums\Icon;
use App\Profiles\Data\ScriptDiagnostic;
use App\Profiles\Data\SignInReceiptInput;
use App\Profiles\Enums\AuthorizationType;
use App\Profiles\Enums\CommandDirectory;
use App\Profiles\Enums\InstancePolicy;
use App\Profiles\Enums\PolicyOriginType;
use App\Profiles\Enums\ProfileChangeType;
use App\Profiles\Enums\SlotContextType;
use App\Records\Contracts\TypeProvider;
use App\Text\Declarations\Section;

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
        return [
            'AccountsWindow.vue',
            'AddAccountPart.vue',
        ];
    }

    public function pages(): array
    {
        return [
            Page::layout('accounts', 'Accounts', Icon::Accounts, AccountsWindowResolver::class)
                ->at('')
                ->visibleWhen(AccountOwnerCheck::class)
                ->loaders(fn (PageLoaders $loaders) => $loaders->add('sign-in-receipt', SignInReceiptLoader::class))
                ->actions(fn (PageActions $actions) => $actions
                    ->post('{account}/activate', ActivateAccountController::class, 'activate')
                    ->patch('{account}', RenameAccountController::class, 'rename')
                    ->post('sign-ins', StartSignInController::class, 'start-sign-in')
                    ->post('{account}/sign-in-again', SignInAgainController::class, 'sign-in-again')
                    ->delete('{account}', RemoveAccountController::class, 'remove')
                    ->post('{account}/cleanup/retry', RetryAccountCleanupController::class, 'retry-cleanup')
                    ->post('{account}/recheck', RecheckAccountController::class, 'recheck')
                    ->post(
                        'sign-ins/{attempt}/cleanup/retry',
                        RetryAttemptCleanupController::class,
                        'retry-sign-in-cleanup',
                    )
                    ->post('notices/{notice}/dismiss', DismissAccountNoticeController::class, 'dismiss')
                    ->post('sign-ins/{attempt}/challenge', SignInChallengeController::class, 'challenge')
                    ->post('sign-ins/{attempt}/code', SubmitSignInCodeController::class, 'submit-code')
                    ->post('sign-ins/{attempt}/cancel', CancelSignInController::class, 'cancel-sign-in')),
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
            SignInReceiptInput::class,
            StartAccountData::class,
            ScriptDiagnostic::class,
            AccountCheckResult::class,
            AccountNoticeReason::class,
            AccountStatus::class,
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
            SignInStatus::class,
            SignInType::class,
            SupervisorCoverageType::class,
            UsageWindowSlot::class,
        ];
    }

    /**
     * The account pages under their own key, accounts, as checked with the domains' declarations.
     */
    public function declarations(): DomainClient
    {
        return DomainClient::ofCore($this, 'Accounts', 'profiles');
    }
}
