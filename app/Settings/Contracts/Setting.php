<?php

declare(strict_types=1);

namespace App\Settings\Contracts;

use App\Settings\Enums\SettingType;

/**
 * One declared setting: its key within its owner, its label and the type of value it holds. Exported because a group
 * lists its settings by it.
 */
interface Setting
{
    public function key(): string;

    public function label(): string;

    public function type(): SettingType;
}
