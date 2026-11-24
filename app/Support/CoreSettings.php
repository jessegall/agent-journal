<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Settings\SettingsDefinition;
use App\Declarations\BooleanSetting;
use App\Declarations\SettingGroup;
use App\Declarations\StringSetting;
use App\Declarations\ToggleGroup;

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
            isDefault: 'Journal',
            minimumLength: 1,
            maximumLength: 200,
            description: 'Shown at the top of every page and in the browser tab.',
        );

        $this->general = SettingGroup::make(
            'general',
            'General',
            [$this->displayName],
            'What this journal is called.',
        );

        $this->remoteProjects = BooleanSetting::make(
            key: 'remote_projects',
            label: 'Connect projects on other machines',
            isDefault: false,
        );

        $this->connectedProjects = SettingGroup::make(
            'connected_projects',
            'Connected projects',
            [$this->remoteProjects],
            'Let projects on other computers connect to this journal.',
        );
    }

    public function groups(): array
    {
        return [$this->general, $this->connectedProjects, ...$this->domainSwitches];
    }
}
