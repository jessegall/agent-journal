<?php

declare(strict_types=1);

namespace App\Console\Concerns;

use Illuminate\Console\Command;

/**
 * Reads the --conditions option and the audience flags a skill write takes.
 *
 * @mixin Command
 */
trait ReadsAudienceOptions
{
    private function conditionsOption(): string|null
    {
        if ($this->option('conditions') === null) {
            return null;
        }

        return (string) $this->option('conditions');
    }

    /**
     * Each audience flag's values, by the condition type it names.
     *
     * @return array<string, list<string>>
     */
    private function audience(): array
    {
        $optionsByType = [
            'profiles' => 'profile',
            'profile-bases' => 'base',
            'drivers' => 'driver',
            'providers' => 'provider',
            'abilities' => 'ability',
        ];

        return array_map(fn (string $option) => $this->optionValues($option), $optionsByType);
    }

    /**
     * @return list<string>
     */
    private function optionValues(string $option): array
    {
        return array_values(array_map(strval(...), (array) $this->option($option)));
    }

    private function hasAudienceOptions(): bool
    {
        return $this->conditionsOption() !== null
            || array_filter($this->audience()) !== [];
    }
}
