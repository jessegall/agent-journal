<?php

declare(strict_types=1);

namespace App\Hooks\Declarations;

use App\Contracts\Event;

/**
 * The checked subscriptions of all installed states.
 */
final readonly class StateEvents
{
    /**
     * @param list<StateEventDeclaration> $declarations
     */
    public function __construct(private array $declarations) {}

    /**
     * @return list<class-string<Event>>
     */
    public function eventClasses(): array
    {
        return array_values(array_unique(array_column($this->declarations, 'event')));
    }

    /**
     * @return list<string>
     */
    public function cacheEntries(): array
    {
        $entries = array_map(fn (StateEventDeclaration $declaration) => $declaration->cacheEntry(), $this->declarations);
        sort($entries);

        return $entries;
    }
}
