<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\ReflectorFactory;
use App\Contracts\Setting;
use App\Declarations\ToggleGroup;
use App\Enums\SettingType;
use App\Exceptions\SettingsAccessDenied;
use App\Exceptions\SettingUnavailable;
use App\Exceptions\SettingValueInvalid;
use App\Values\GroupReference;
use App\Values\SettingReference;

/**
 * Turns the address a settings command carries into the registered declaration it names, after checking first that
 * the command's actor may change settings at all. Every settings handler starts here.
 *
 * @internal
 */
final readonly class SettingTargets
{
    public function __construct(
        private SettingsAccessGate $gate,
        private SettingRegistry $registry,
        private ReflectorFactory $reflectors,
    ) {}

    /**
     * The registered setting of exactly this declaration class.
     *
     * @template TSetting of Setting
     *
     * @param  class-string<TSetting>  $declaration
     * @return TSetting
     *
     * @throws SettingsAccessDenied
     * @throws SettingUnavailable
     * @throws SettingValueInvalid
     */
    public function setting(SettingReference $reference, string $declaration, SettingType $commandType): Setting
    {
        $setting = $this->anySetting($reference);

        return $this->reflectors->make($declaration)->isInstance($setting)
            ? $setting
            : throw SettingValueInvalid::for($reference->owner, $reference->key, $commandType);
    }

    /**
     * The registered setting, whatever its declaration class.
     *
     * @throws SettingsAccessDenied
     * @throws SettingUnavailable
     */
    public function anySetting(SettingReference $reference): Setting
    {
        $this->gate->require();

        return $this->registry->settingAt($reference->owner, $reference->key);
    }

    /**
     * The registered group that can be switched off; a plain group is refused.
     *
     * @throws SettingsAccessDenied
     * @throws SettingUnavailable
     * @throws SettingValueInvalid
     */
    public function toggleGroup(GroupReference $reference): ToggleGroup
    {
        $this->gate->require();
        $group = $this->registry->groupAt($reference->owner, $reference->key);

        return $group instanceof ToggleGroup ? $group : throw SettingValueInvalid::notToggleGroup(
            $reference->owner,
            $reference->key,
        );
    }
}
