<?php

declare(strict_types=1);

namespace App\Pages;

use App\Http\Pages\SettingsPageBuilder;
use App\Http\Pages\SettingsPageData;
use App\Declarations\Page;
use App\Declarations\PageActions;
use App\Http\Controllers\ResetSettingsPageController;
use App\Http\Controllers\SaveSettingsPageController;
use App\Http\Controllers\SwitchSettingsGroupPageController;
use App\Navigation\Contracts\NavigationProvider;
use App\Navigation\Contracts\PageProvider;
use App\Navigation\Declarations\DomainClient;
use App\Navigation\Declarations\NavigationItem;
use App\Navigation\Enums\Icon;
use App\Records\Contracts\TypeProvider;
use App\Settings\Data\BooleanValueData;
use App\Settings\Data\DecimalConstraintsData;
use App\Settings\Data\DecimalValueData;
use App\Settings\Data\IntegerChoiceConstraintsData;
use App\Settings\Data\IntegerChoiceOptionData;
use App\Settings\Data\IntegerChoiceValueData;
use App\Settings\Data\IntegerConstraintsData;
use App\Settings\Data\IntegerValueData;
use App\Settings\Data\InvalidValueData;
use App\Settings\Data\PlainGroupAvailabilityData;
use App\Settings\Data\SettingData;
use App\Settings\Data\SettingGroupData;
use App\Settings\Data\SettingIdentityData;
use App\Settings\Data\SettingsCatalogueData;
use App\Settings\Data\StringChoiceConstraintsData;
use App\Settings\Data\StringChoiceOptionData;
use App\Settings\Data\StringChoiceValueData;
use App\Settings\Data\StringConstraintsData;
use App\Settings\Data\StringValueData;
use App\Settings\Data\ToggleGroupAvailabilityData;
use App\Settings\Enums\GroupAvailability;
use App\Settings\Enums\SettingAvailability;
use App\Settings\Enums\SettingSource;
use App\Settings\Enums\SettingsOutcome;
use App\Settings\Enums\SettingTarget;
use App\Settings\Enums\SettingType;
use App\Settings\SettingsOwnerCheck;

/**
 * The page Core's Settings declares, for the owner alone, at /settings: every owner's settings as groups, with saving a
 * group's edited values, resetting its changed ones and switching a group on or off.
 */
final class SettingsPages implements NavigationProvider, PageProvider, TypeProvider
{
    public function pages(): array
    {
        return [
            Page::build()
                ->key('settings')
                ->title('Settings')
                ->icon(Icon::Rules)
                ->pageType(SettingsPageData::class)
                ->pageBuilder(SettingsPageBuilder::class)
                ->declaredLayout()
                ->finish()
                ->at('')
                ->visibleWhen(SettingsOwnerCheck::class)
                ->actions(fn (PageActions $actions) => $actions
                    ->post('save', SaveSettingsPageController::class, 'save')
                    ->post('reset', ResetSettingsPageController::class, 'reset')
                    ->post('switch', SwitchSettingsGroupPageController::class, 'switch')),
        ];
    }

    public function navigation(): array
    {
        return [NavigationItem::page('settings', 'Settings', Icon::Settings, position: 90)];
    }

    /**
     * The data classes and enums these pages own, generated in the settings module.
     */
    public function types(): array
    {
        return [
            BooleanValueData::class,
            DecimalConstraintsData::class,
            DecimalValueData::class,
            IntegerChoiceConstraintsData::class,
            IntegerChoiceOptionData::class,
            IntegerChoiceValueData::class,
            IntegerConstraintsData::class,
            IntegerValueData::class,
            InvalidValueData::class,
            PlainGroupAvailabilityData::class,
            SettingData::class,
            SettingGroupData::class,
            SettingIdentityData::class,
            SettingsCatalogueData::class,
            StringChoiceConstraintsData::class,
            StringChoiceOptionData::class,
            StringChoiceValueData::class,
            StringConstraintsData::class,
            StringValueData::class,
            ToggleGroupAvailabilityData::class,
            GroupAvailability::class,
            SettingAvailability::class,
            SettingSource::class,
            SettingTarget::class,
            SettingType::class,
            SettingsOutcome::class,
        ];
    }

    /**
     * The settings page under its own key, settings, as checked with the domains' declarations.
     */
    public function declarations(): DomainClient
    {
        return DomainClient::ofCore($this, 'Settings', 'settings');
    }
}
