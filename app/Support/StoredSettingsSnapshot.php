<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\EnabledSettingsGroup;
use App\Contracts\SettingsSnapshot;
use App\Declarations\BooleanSetting;
use App\Declarations\ChoiceSetting;
use App\Declarations\DecimalSetting;
use App\Declarations\EnumSetting;
use App\Declarations\IntegerSetting;
use App\Declarations\StringSetting;
use App\Declarations\ToggleGroup;
use App\Exceptions\GroupSnapshotRequired;
use App\Exceptions\SettingStorageInvalid;
use App\Exceptions\SettingUnavailable;
use App\Values\Decimal;
use BackedEnum;

/**
 * Every setting of one owner from one read at one revision: the plain groups' settings directly and each group that
 * can be switched off through group(). It lives no longer than the request or job that took it.
 */
final readonly class StoredSettingsSnapshot implements SettingsSnapshot
{
    public string $owner;

    public int $revision;

    public function __construct(private StoredSettings $stored)
    {
        $this->owner = $stored->owner;
        $this->revision = $stored->revision;
    }

    /**
     * @throws SettingUnavailable
     * @throws SettingStorageInvalid
     */
    public function group(ToggleGroup $group): EnabledSettingsGroup|DisabledSettingsGroup
    {
        return $this->stored->group($group);
    }

    /**
     * @throws SettingUnavailable
     * @throws GroupSnapshotRequired
     * @throws SettingStorageInvalid
     */
    public function string(StringSetting $setting): string
    {
        $this->stored->requirePlain($setting);

        return $this->stored->string($setting);
    }

    /**
     * @throws SettingUnavailable
     * @throws GroupSnapshotRequired
     * @throws SettingStorageInvalid
     */
    public function boolean(BooleanSetting $setting): bool
    {
        $this->stored->requirePlain($setting);

        return $this->stored->boolean($setting);
    }

    /**
     * @throws SettingUnavailable
     * @throws GroupSnapshotRequired
     * @throws SettingStorageInvalid
     */
    public function integer(IntegerSetting $setting): int
    {
        $this->stored->requirePlain($setting);

        return $this->stored->integer($setting);
    }

    /**
     * @throws SettingUnavailable
     * @throws GroupSnapshotRequired
     * @throws SettingStorageInvalid
     */
    public function decimal(DecimalSetting $setting): Decimal
    {
        $this->stored->requirePlain($setting);

        return $this->stored->decimal($setting);
    }

    /**
     * @template TValue of string|int
     *
     * @param  ChoiceSetting<TValue>  $setting
     * @return TValue
     *
     * @throws SettingUnavailable
     * @throws GroupSnapshotRequired
     * @throws SettingStorageInvalid
     */
    public function choice(ChoiceSetting $setting): string|int
    {
        $this->stored->requirePlain($setting);

        return $this->stored->choice($setting);
    }

    /**
     * @template TEnum of BackedEnum
     *
     * @param  EnumSetting<TEnum>  $setting
     * @return TEnum
     *
     * @throws SettingUnavailable
     * @throws GroupSnapshotRequired
     * @throws SettingStorageInvalid
     */
    public function enum(EnumSetting $setting): BackedEnum
    {
        $this->stored->requirePlain($setting);

        return $this->stored->enum($setting);
    }
}
