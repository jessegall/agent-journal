<?php

declare(strict_types=1);

namespace App\Settings\Support;

use App\Settings\Contracts\GroupDeclaration;
use App\Settings\Contracts\Setting;
use App\Settings\Contracts\SettingsCatalogue;
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
use App\Settings\Declarations\BooleanSetting;
use App\Settings\Declarations\ChoiceSetting;
use App\Settings\Declarations\DecimalSetting;
use App\Settings\Declarations\EnumSetting;
use App\Settings\Declarations\IntegerSetting;
use App\Settings\Declarations\StringSetting;
use App\Settings\Declarations\ToggleGroup;
use App\Settings\Enums\GroupAvailability;
use App\Settings\Enums\SettingAvailability;
use App\Settings\Enums\SettingSource;
use App\Settings\Exceptions\SettingHandleUnknown;
use App\Settings\Exceptions\SettingsOwnerUnknown;
use App\Settings\Exceptions\SettingStorageInvalid;
use App\Settings\Models\SettingsRecord;
use App\Settings\Storage\EncodedSetting;
use App\Settings\Storage\EncodedToggle;
use App\Settings\Storage\SettingsDocument;
use App\Settings\Values\Choice;
use App\Settings\Values\Decimal;
use BackedEnum;
use Spatie\LaravelData\Optional;

/**
 * Builds one owner's catalogue from a single read of its record, for an actor the access policy allows. A stored value
 * its setting does not accept is shown as invalid with its address, so it can be reset; the rest stay readable.
 */
final readonly class DatabaseSettingsCatalogue implements SettingsCatalogue
{
    public const string TITLE = 'Settings';

    public function __construct(
        private SettingsAccessGate $gate,
        private SettingRegistry $registry,
        private SettingCodec $codec,
    ) {}

    public function owner(string $owner): SettingsCatalogueData
    {
        $this->gate->require();

        if (! array_key_exists($owner, $this->registry->definitions())) {
            throw SettingsOwnerUnknown::for($owner);
        }

        $record = SettingsRecord::sharedRuntimeForOwner($owner);
        $document = $record->map(fn (SettingsRecord $found) => $found->document)->getOrCall(SettingsDocument::empty(...));

        return SettingsCatalogueData::from([
            'owner' => $owner,
            'title' => self::TITLE,
            'revision' => $record->map(fn (SettingsRecord $found) => $found->revision)->getOrElse(0),
            'groups' => array_map(fn (GroupDeclaration $group) => $this->group($owner, $group, $document), $this->registry->definition($owner)->groups()),
        ]);
    }

    private function group(string $owner, GroupDeclaration $group, SettingsDocument $document): SettingGroupData
    {
        $state = $group instanceof ToggleGroup ? $this->toggleState($owner, $group, $document) : GroupAvailability::Always;
        $availability = $group instanceof ToggleGroup
            ? ToggleGroupAvailabilityData::from(['state' => $state, 'defaultEnabled' => $group->defaultEnabled])
            : PlainGroupAvailabilityData::from([]);

        return SettingGroupData::from([
            'identity' => $this->identity($owner, $group->key()),
            'label' => $group->label(),
            'availability' => $availability,
            'settings' => array_map(fn (Setting $setting) => $this->setting($owner, $setting, $state, $document), $group->settings()),
        ]);
    }

    /**
     * Whether the group is on, off, or has a stored switch that is not a boolean.
     */
    private function toggleState(string $owner, ToggleGroup $group, SettingsDocument $document): GroupAvailability
    {
        try {
            $enabled = $document->toggle($group->key)
                ->map(fn (EncodedToggle $toggle) => $this->codec->decodeToggle($owner, $group, $toggle->value))
                ->getOrElse($group->defaultEnabled);
        } catch (SettingStorageInvalid) {
            return GroupAvailability::Invalid;
        }

        return $enabled ? GroupAvailability::Enabled : GroupAvailability::Disabled;
    }

    private function setting(string $owner, Setting $setting, GroupAvailability $groupState, SettingsDocument $document): SettingData
    {
        $stored = $document->setting($setting->key());

        return SettingData::from([
            'identity' => $this->identity($owner, $setting->key()),
            'label' => $setting->label(),
            'type' => $setting->type(),
            'source' => $stored->isDefined() ? SettingSource::Override : SettingSource::Default,
            'availability' => match ($groupState) {
                GroupAvailability::Disabled => SettingAvailability::GroupDisabled,
                GroupAvailability::Invalid => SettingAvailability::GroupInvalid,
                default => SettingAvailability::Available,
            },
            'default' => $this->valueData($setting, $this->defaultOf($setting)),
            'constraints' => $this->constraints($setting),
            'configured' => $stored->map(fn (EncodedSetting $entry) => $this->configured($owner, $setting, $entry))->getOrCall(Optional::create(...)),
        ]);
    }

    /**
     * The stored value when the setting accepts it, otherwise a marker that names nothing of what was stored.
     */
    private function configured(string $owner, Setting $setting, EncodedSetting $entry): StringValueData|BooleanValueData|IntegerValueData|DecimalValueData|StringChoiceValueData|IntegerChoiceValueData|InvalidValueData
    {
        try {
            return $this->valueData($setting, $this->codec->decode($owner, $setting, $entry->value));
        } catch (SettingStorageInvalid) {
            return InvalidValueData::from([]);
        }
    }

    private function defaultOf(Setting $setting): string|bool|int|Decimal|BackedEnum
    {
        return match (true) {
            $setting instanceof StringSetting,
            $setting instanceof BooleanSetting,
            $setting instanceof IntegerSetting,
            $setting instanceof DecimalSetting,
            $setting instanceof ChoiceSetting,
            $setting instanceof EnumSetting => $setting->default,
            default => throw SettingHandleUnknown::for($setting::class, $setting->key()),
        };
    }

    /**
     * A native value as the variant its setting's type shows: decimals as their text, enum cases as their backing.
     */
    private function valueData(Setting $setting, string|bool|int|Decimal|BackedEnum $value): StringValueData|BooleanValueData|IntegerValueData|DecimalValueData|StringChoiceValueData|IntegerChoiceValueData
    {
        $wire = match (true) {
            $value instanceof Decimal => $value->text,
            $value instanceof BackedEnum => $value->value,
            default => $value,
        };

        return match (true) {
            $setting instanceof StringSetting => StringValueData::from(['value' => $wire]),
            $setting instanceof BooleanSetting => BooleanValueData::from(['value' => $wire]),
            $setting instanceof IntegerSetting => IntegerValueData::from(['value' => $wire]),
            $setting instanceof DecimalSetting => DecimalValueData::from(['value' => $wire]),
            is_int($wire) => IntegerChoiceValueData::from(['value' => $wire]),
            default => StringChoiceValueData::from(['value' => $wire]),
        };
    }

    private function constraints(Setting $setting): StringConstraintsData|IntegerConstraintsData|DecimalConstraintsData|StringChoiceConstraintsData|IntegerChoiceConstraintsData|Optional
    {
        return match (true) {
            $setting instanceof StringSetting => StringConstraintsData::from(['minimumLength' => $setting->minimumLength, 'maximumLength' => $setting->maximumLength]),
            $setting instanceof IntegerSetting => IntegerConstraintsData::from(['minimum' => $setting->minimum, 'maximum' => $setting->maximum]),
            $setting instanceof DecimalSetting => DecimalConstraintsData::from(array_filter([
                'precision' => $setting->precision,
                'scale' => $setting->scale,
                'minimum' => $setting->minimum?->text,
                'maximum' => $setting->maximum?->text,
            ], fn (int|string|null $field) => $field !== null)),
            $setting instanceof ChoiceSetting, $setting instanceof EnumSetting => $this->choiceConstraints($setting->options()),
            default => Optional::create(),
        };
    }

    /**
     * @param  list<Choice<string|int>>  $options
     */
    private function choiceConstraints(array $options): StringChoiceConstraintsData|IntegerChoiceConstraintsData
    {
        return is_int($options[0]->value)
            ? IntegerChoiceConstraintsData::from(['options' => array_map(fn (Choice $option) => IntegerChoiceOptionData::from(['value' => $option->value, 'label' => $option->label]), $options)])
            : StringChoiceConstraintsData::from(['options' => array_map(fn (Choice $option) => StringChoiceOptionData::from(['value' => $option->value, 'label' => $option->label]), $options)]);
    }

    private function identity(string $owner, string $key): SettingIdentityData
    {
        return SettingIdentityData::from(['owner' => $owner, 'key' => $key, 'canonicalKey' => "{$owner}.{$key}"]);
    }
}
