<?php

declare(strict_types=1);

namespace Domain\Rules\Events;

use App\Contracts\Events\Event;

/**
 * A fact about project rules: every event of that subject extends it, so a listener typed on it hears them all.
 */
abstract readonly class RuleEvent implements Event {}
