<?php

declare(strict_types=1);

namespace App\Pages;

use App\Contracts\Navigation\NavigationProvider;
use App\Contracts\Navigation\PageProvider;
use App\Contracts\Records\TypeProvider;
use App\Data\BooleanValueData;
use App\Data\DecimalConstraintsData;
use App\Data\DecimalValueData;
use App\Data\IntegerChoiceConstraintsData;
use App\Data\IntegerChoiceOptionData;
use App\Data\IntegerChoiceValueData;
use App\Data\IntegerConstraintsData;
use App\Data\IntegerValueData;
use App\Data\InvalidValueData;
use App\Data\PlainGroupAvailabilityData;
use App\Data\SettingData;
use App\Data\SettingGroupData;
use App\Data\SettingIdentityData;
use App\Data\SettingsCatalogueData;
use App\Data\StringChoiceConstraintsData;
use App\Data\StringChoiceOptionData;
use App\Data\StringChoiceValueData;
use App\Data\StringConstraintsData;
use App\Data\StringValueData;
use App\Data\ToggleGroupAvailabilityData;
use App\Declarations\ActionRoute;
use App\Declarations\DomainUi;
use App\Declarations\NavigationItem;
use App\Declarations\Page;
use App\Enums\GroupAvailability;
use App\Enums\Icon;
use App\Enums\SettingAvailability;
use App\Enums\SettingSource;
use App\Enums\SettingsOutcome;
use App\Enums\SettingTarget;
use App\Enums\SettingType;
use App\Http\Controllers\ResetSettingsPageController;
use App\Http\Controllers\SaveSettingsPageController;
use App\Resolvers\SettingsWindowResolver;
use App\Support\SettingsOwnerCheck;

/**
 * The page Core's Settings declares, for the owner alone, at /settings: every owner's settings as groups, with saving a
 * group's edited values and resetting its changed ones.
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
    public function declarations(): DomainUi
    {
        return DomainUi::ofCore($this, 'Settings', 'settings');
    }
}
