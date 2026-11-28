<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Web\Creation\Exceptions\MissingFields;

final class SettingsPageFields
{
    /** @var list<SettingsGroup> */
    private array $groups;

    public function groups(SettingsGroup ...$groups): self
    {
        $this->groups = array_values($groups);

        return $this;
    }

    public function finish(): SettingsPage
    {
        if (! isset($this->groups)) {
            throw MissingFields::forType(SettingsPage::class, 'groups');
        }

        return new SettingsPage(
            groups: $this->groups,
        );
    }
}
