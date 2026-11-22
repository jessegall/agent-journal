<?php

declare(strict_types=1);

namespace App\Support;

/**
 * The declared listeners by event and the ownership rules for their registration.
 */
final readonly class ListenerDeclarations
{
    /**
     * @param  array<string, list<string>>  $events
     * @param  array<string, list<string>>  $required  the listeners the command's transaction requires, by event
     */
    public function __construct(
        public array $events,
        public ListenerOwnership $ownership,
        public array $required = [],
    ) {}
}
