<?php

declare(strict_types=1);

namespace App\Support\Layout;

/**
 * The shared recipe of a settings page: its groups in the order the declaration gives them, in a column no wider than
 * the settings reader. A domain hands in neutral groups, rows and forms only.
 */
final readonly class SettingsPage
{
    /**
     * @param  list<SettingsGroup>  $groups
     */
    private function __construct(private array $groups) {}

    public static function make(SettingsGroup ...$groups): self
    {
        return new self(array_values($groups));
    }

    public function layout(): DeclaredLayoutData
    {
        return DeclaredLayoutData::of(LayoutPartData::box(
            'settings-page',
            'settings-page',
            ...array_map(fn (SettingsGroup $group) => $group->part(), $this->groups),
        ));
    }
}
