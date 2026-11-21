<?php

declare(strict_types=1);

namespace App\Scripts\Pages;

use App\Profiles\Support\AccountOwnerCheck;
use App\Scripts\Http\Controllers\Pages\CheckDraftPageController;
use App\Scripts\Http\Controllers\Pages\SaveDraftPageController;
use App\Scripts\Resolvers\ProfileScriptWindowResolver;
use App\Ui\Contracts\PageProvider;
use App\Ui\Declarations\ActionRoute;
use App\Ui\Declarations\DomainUi;
use App\Ui\Declarations\Page;
use App\Ui\Enums\Icon;

/**
 * The pages Core's Scripts declares, for the owner alone, under /scripts: the script editor of one profile.
 */
final class ScriptsPages implements PageProvider
{
    public function pages(): array
    {
        return [
            Page::make(
                'profile-script',
                'Profile script',
                Icon::Accounts,
                ProfileScriptWindowResolver::class,
                'ProfileScriptWindow.vue',
            )
                ->at('{profile}')
                ->visibleWhen(AccountOwnerCheck::class)
                ->actions(
                    ActionRoute::post('{profile}/draft/check', CheckDraftPageController::class, 'check-draft'),
                    ActionRoute::post('{profile}/draft/save', SaveDraftPageController::class, 'save-draft'),
                ),
        ];
    }

    /**
     * The script pages under their own key, scripts, as checked with the domains' declarations.
     */
    public function declarations(): DomainUi
    {
        return DomainUi::of($this, 'Scripts', 'App\\Scripts', dirname(__DIR__).'/Resources/js');
    }
}
