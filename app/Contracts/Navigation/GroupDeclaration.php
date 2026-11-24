<?php

declare(strict_types=1);

namespace App\Contracts\Navigation;

use App\Contracts\Settings\Setting;

/**
 * A declared group of settings: its key, its label and the settings it holds, in order. Groups hold settings only,
 * never other groups.
 */
interface GroupDeclaration
{
    /**
     * The key the navigation group is found under.
     */
    public function key(): string;

    /**
     * The name users see for the navigation group.
     */
    public function label(): string;

    /**
     * The sentence the settings page shows under the group's heading; null when the heading says it all.
     */
    public function description(): string|null;

    /**
     * @return list<Setting>
     */
    public function settings(): array;
}
