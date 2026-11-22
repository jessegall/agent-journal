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
    public function key(): string;

    public function label(): string;

    /**
     * @return list<Setting>
     */
    public function settings(): array;
}
