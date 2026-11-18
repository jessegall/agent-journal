<?php

declare(strict_types=1);

namespace App\Skills\Console\Concerns;

use Illuminate\Console\Command;

/**
 * Reads the --conditions option and the audience flags a skill write takes.
 *
 * @mixin Command
 */
trait ReadsAudienceOptions
{
    private function conditionsOption(): ?string
    {
        return $this->option('conditions') === null ? null : (string) $this->option('conditions');
    }

    /**
     * Each audience flag's values, by the condition type it compiles to.
     *
     * @return array<string, list<string>>
     */
    private function audience(): array
    {
        return [
            'profiles' => array_map(strval(...), (array) $this->option('profile')),
            'agent-types' => array_map(strval(...), (array) $this->option('type')),
            'programs' => array_map(strval(...), (array) $this->option('program')),
            'providers' => array_map(strval(...), (array) $this->option('provider')),
        ];
    }

    private function namesAudience(): bool
    {
        return $this->conditionsOption() !== null || (bool) $this->option('main-agent') || array_filter($this->audience()) !== [];
    }
}
