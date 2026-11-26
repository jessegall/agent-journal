<?php

declare(strict_types=1);

namespace App\Bus;

/**
 * The declared listeners by event and the ownership rules for their registration.
 */
final readonly class ListenerDeclarations
{
    /**
     * @param  array<string, list<string>>  $events
     * @param  array<string, list<string>>  $inCommandTransaction  the listeners the command's transaction runs, by event
     */
    public function __construct(
        public array $events,
        public ListenerOwnership $ownership,
        public array $inCommandTransaction = [],
    ) {}
}
