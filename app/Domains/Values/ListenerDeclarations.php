<?php

declare(strict_types=1);

namespace App\Domains\Values;

use App\Domains\Support\ListenerOwnership;

/**
 * The declared listeners by event and the ownership rules for their registration.
 */
final readonly class ListenerDeclarations
{
    /**
     * @param  array<string, list<string>>  $events
     */
    public function __construct(public array $events, public ListenerOwnership $ownership) {}
}
