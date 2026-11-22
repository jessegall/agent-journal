<?php

declare(strict_types=1);

namespace App\Profiles\Pages;

use App\Profiles\Http\Controllers\ActivateAccountController;
use App\Profiles\Http\Controllers\CancelSignInController;
use App\Profiles\Http\Controllers\DismissAccountNoticeController;
use App\Profiles\Http\Controllers\RecheckAccountController;
use App\Profiles\Http\Controllers\RemoveAccountController;
use App\Profiles\Http\Controllers\RenameAccountController;
use App\Profiles\Http\Controllers\RetryAccountCleanupController;
use App\Profiles\Http\Controllers\RetryAttemptCleanupController;
use App\Profiles\Http\Controllers\SignInAgainController;
use App\Profiles\Http\Controllers\SignInChallengeController;
use App\Profiles\Http\Controllers\SignInReceiptController;
use App\Profiles\Http\Controllers\StartSignInController;
use App\Profiles\Http\Controllers\SubmitSignInCodeController;
use App\Profiles\Resolvers\AccountNoticesSection;
use App\Profiles\Resolvers\AccountsWindowResolver;
use App\Profiles\Resolvers\StartAccountWindowResolver;
use App\Profiles\Support\AccountOwnerCheck;
use App\Ui\Contracts\NavigationProvider;
use App\Ui\Contracts\PageProvider;
use App\Ui\Contracts\SectionProvider;
use App\Ui\Declarations\ActionRoute;
use App\Ui\Declarations\DomainUi;
use App\Ui\Declarations\NavigationItem;
use App\Ui\Declarations\Page;
use App\Ui\Declarations\Section;
use App\Ui\Enums\Icon;
use App\Ui\Enums\SlotContextType;

/**
 * The pages Core's Profiles declares, for the owner alone, under /accounts: the saved Claude Code and Codex accounts,
 * with choosing the one each driver starts with and renaming one.
 */
final class ProfilesPages implements NavigationProvider, PageProvider, SectionProvider
{
    public function pages(): array
    {
        return [
            Page::make('accounts', 'Accounts', Icon::Accounts, AccountsWindowResolver::class, 'AccountsWindow.vue')
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
        return [NavigationItem::page('accounts', 'Accounts', Icon::Accounts, group: 'Agents', position: 40)];
    }

    /**
     * The account pages under their own key, accounts, as checked with the domains' declarations.
     */
    public function declarations(): DomainUi
    {
        return DomainUi::of($this, 'Accounts', 'App\\Profiles', dirname(__DIR__).'/Resources/js');
    }
}
