<?php

declare(strict_types=1);

namespace App\Settings\Pages;

use App\Settings\Http\Controllers\ResetSettingsPageController;
use App\Settings\Http\Controllers\SaveSettingsPageController;
use App\Settings\Resolvers\SettingsWindowResolver;
use App\Settings\Support\SettingsOwnerCheck;
use App\Ui\Contracts\NavigationProvider;
use App\Ui\Contracts\PageProvider;
use App\Ui\Declarations\ActionRoute;
use App\Ui\Declarations\DomainUi;
use App\Ui\Declarations\NavigationItem;
use App\Ui\Declarations\Page;
use App\Ui\Enums\Icon;

/**
 * The page Core's Settings declares, for the owner alone, at /settings: every owner's settings as groups, with saving a
 * group's edited values and resetting its changed ones.
 */
final class SettingsPages implements NavigationProvider, PageProvider
{
    public function pages(): array
    {
        return [
            Page::layout('settings', 'Settings', Icon::Rules, SettingsWindowResolver::class)
                ->at('')
                ->visibleWhen(SettingsOwnerCheck::class)
                ->actions(
                    ActionRoute::post('save', SaveSettingsPageController::class, 'save'),
                    ActionRoute::post('reset', ResetSettingsPageController::class, 'reset'),
                ),
        ];
    }

    public function navigation(): array
    {
        return [NavigationItem::page('settings', 'Settings', Icon::Rules, group: 'web.agents', position: 90)];
    }

    /**
     * The settings page under its own key, settings, as checked with the domains' declarations.
     */
    public function declarations(): DomainUi
    {
        return DomainUi::of($this, 'Settings', 'App\\Settings', dirname(__DIR__).'/Resources/js');
    }
}
