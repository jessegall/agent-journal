<?php

declare(strict_types=1);

namespace App\Hooks\Events;

use App\Contracts\AnsweredAtOnce;
use App\Hooks\StateCatalog\Registration\Contracts\StateRegistration;

/**
 * Raised while collecting state declarations: a domain listener registers its own state types here, at
 * once, through the narrow registration it is handed.
 */
final readonly class StateTypesRequested implements AnsweredAtOnce
{
    public function __construct(public StateRegistration $registry) {}
}
