<?php

declare(strict_types=1);

namespace App\Profiles\Pages;

use App\Profiles\Http\Controllers\ActivateAccountController;
use App\Profiles\Http\Controllers\RenameAccountController;
use App\Profiles\Resolvers\AccountsWindowResolver;
use App\Profiles\Support\AccountOwnerCheck;
use App\Ui\Contracts\ProvidesNavigation;
use App\Ui\Contracts\ProvidesPages;
use App\Ui\Declarations\ActionRoute;
use App\Ui\Declarations\DomainUi;
use App\Ui\Declarations\NavigationItem;
use App\Ui\Declarations\Page;
use App\Ui\Enums\Icon;

/**
 * The pages Core's Profiles declares, for the owner alone, under /accounts: the saved Claude Code and Codex accounts,
 * with choosing the one each program launches with and renaming one.
 */
final class ProfilesPages implements ProvidesNavigation, ProvidesPages
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
