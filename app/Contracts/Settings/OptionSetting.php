<?php

declare(strict_types=1);

namespace App\Contracts\Settings;

/**
 * A setting whose value is one of a fixed list of options, such as a choice or a backed enum.
 */
interface OptionSetting extends Setting
{
    /**
     * Whether the value is exactly one of the setting's options.
     */
    public function accepts(string|int $optionKey): bool;
}
