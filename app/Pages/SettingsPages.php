<?php

declare(strict_types=1);

namespace App\Pages;

use App\Contracts\Navigation\NavigationProvider;
use App\Contracts\Navigation\PageProvider;
use App\Contracts\Records\TypeProvider;
use App\Data\Settings\BooleanValueData;
use App\Data\Settings\DecimalConstraintsData;
use App\Data\Settings\DecimalValueData;
use App\Data\Settings\IntegerChoiceConstraintsData;
use App\Data\Settings\IntegerChoiceOptionData;
use App\Data\Settings\IntegerChoiceValueData;
use App\Data\Settings\IntegerConstraintsData;
use App\Data\Settings\IntegerValueData;
use App\Data\Settings\InvalidValueData;
use App\Data\Settings\PlainGroupAvailabilityData;
use App\Data\Settings\SettingData;
use App\Data\Settings\SettingGroupData;
use App\Data\Settings\SettingIdentityData;
use App\Data\Settings\SettingsCatalogueData;
use App\Data\Settings\StringChoiceConstraintsData;
use App\Data\Settings\StringChoiceOptionData;
use App\Data\Settings\StringChoiceValueData;
use App\Data\Settings\StringConstraintsData;
use App\Data\Settings\StringValueData;
use App\Data\Settings\ToggleGroupAvailabilityData;
use App\Declarations\ActionRoute;
use App\Declarations\DomainClient;
use App\Declarations\NavigationItem;
use App\Declarations\Page;
use App\Enums\Navigation\Icon;
use App\Enums\Settings\GroupAvailability;
use App\Enums\Settings\SettingAvailability;
use App\Enums\Settings\SettingSource;
use App\Enums\Settings\SettingsOutcome;
use App\Enums\Settings\SettingTarget;
use App\Enums\Settings\SettingType;
use App\Http\Controllers\ResetSettingsPageController;
use App\Http\Controllers\SaveSettingsPageController;
use App\Http\Controllers\SwitchSettingsGroupPageController;
use App\Http\Pages\Resolvers\SettingsWindowResolver;
use App\Support\SettingsOwnerCheck;

/**
 * The page Core's Settings declares, for the owner alone, at /settings: every owner's settings as groups, with saving a
 * group's edited values, resetting its changed ones and switching a group on or off.
 */
final class SettingsPages implements NavigationProvider, PageProvider, TypeProvider
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
                    ActionRoute::post('switch', SwitchSettingsGroupPageController::class, 'switch'),
                ),
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
