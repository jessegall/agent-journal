<?php

declare(strict_types=1);

namespace Tests\Fixtures\Settings;

use App\Settings\Contracts\SettingsDefinition;
use App\Settings\Declarations\SettingGroup;

/**
 * A fixture settings definition built from the groups given to it.
 */
final readonly class SettingsList implements SettingsDefinition
{
    /**
     * @param  list<SettingGroup>  $groups
     */
    public function __construct(private array $groups) {}

    public function groups(): array
    {
        return $this->groups;
    }
}
