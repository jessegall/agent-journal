<?php

declare(strict_types=1);

namespace App\Settings\Support;

use App\Actors\Contracts\CurrentActor;
use App\Settings\Contracts\Setting;
use App\Settings\Contracts\SettingsAccessPolicy;
use App\Settings\Declarations\ToggleGroup;
use App\Settings\Enums\SettingType;
use App\Settings\Exceptions\SettingsAccessDenied;
use App\Settings\Exceptions\SettingUnavailable;
use App\Settings\Exceptions\SettingValueInvalid;
use App\Settings\Values\GroupReference;
use App\Settings\Values\SettingReference;

/**
 * Turns the address a settings command carries into the registered declaration it names, after checking first that
 * the command's actor may change settings at all. Every settings handler starts here.
 *
 * @internal
 */
final readonly class SettingTargets
{
    public function __construct(
        private CurrentActor $actor,
        private SettingsAccessPolicy $access,
        private SettingRegistry $registry,
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

        return $setting instanceof $declaration ? $setting : throw SettingValueInvalid::for($reference->owner, $reference->key, $commandType);
    }

    /**
     * The registered setting, whatever its declaration class.
     *
     * @throws SettingsAccessDenied
     * @throws SettingUnavailable
     */
    public function anySetting(SettingReference $reference): Setting
    {
        $this->requireAccess();

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
        $this->requireAccess();
        $group = $this->registry->groupAt($reference->owner, $reference->key);

        return $group instanceof ToggleGroup ? $group : throw SettingValueInvalid::notToggleGroup($reference->owner, $reference->key);
    }

    /**
     * @throws SettingsAccessDenied
     */
    private function requireAccess(): void
    {
        if (! $this->access->allows($this->actor->actor())) {
            throw SettingsAccessDenied::forActor();
        }
    }
}
