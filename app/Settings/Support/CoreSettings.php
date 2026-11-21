<?php

declare(strict_types=1);

namespace App\Settings\Support;

use App\Settings\Contracts\SettingsDefinition;
use App\Settings\Declarations\BooleanSetting;
use App\Settings\Declarations\SettingGroup;
use App\Settings\Declarations\StringSetting;
use App\Settings\Declarations\ToggleGroup;

/**
 * The settings Core itself declares.
 */
final class CoreSettings implements SettingsDefinition
{
    public readonly StringSetting $displayName;

    public readonly SettingGroup $general;

    public readonly BooleanSetting $remoteProjects;

    public readonly SettingGroup $connectedProjects;

    /**
     * @param  list<ToggleGroup>  $domainSwitches  the groups that switch each domain, listed after Core's own
     */
    public function __construct(private readonly array $domainSwitches = [])
    {
        $this->displayName = StringSetting::make(
            key: 'display_name',
            label: 'Journal name',
            default: 'Journal',
            minimumLength: 1,
            maximumLength: 200,
        );
        $this->general = SettingGroup::make('general', 'General', [$this->displayName]);
        $this->remoteProjects = BooleanSetting::make(
            key: 'remote_projects',
            label: 'Connect projects on other machines',
            default: false,
        );
        $this->connectedProjects = SettingGroup::make(
            'connected_projects',
            'Connected projects',
            [$this->remoteProjects],
        );
    }

    public function groups(): array
    {
        return [$this->general, $this->connectedProjects, ...$this->domainSwitches];
    }
}
