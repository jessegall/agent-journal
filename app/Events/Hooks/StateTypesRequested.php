<?php

declare(strict_types=1);

namespace App\Events\Hooks;

use App\Contracts\Asks\AnsweredAtOnce;
use App\Support\StateCatalog\Registration\Contracts\StateRegistration;

/**
 * Raised while collecting state declarations: a domain listener registers its own state types here, at
 * once, through the narrow registration it is handed.
 */
final readonly class StateTypesRequested implements AnsweredAtOnce, HookEvent
{
    public function __construct(public StateRegistration $registry) {}
}
