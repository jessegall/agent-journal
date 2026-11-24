<?php

declare(strict_types=1);

namespace Domain\Chat\Contracts;

use App\Contracts\Events\Event;

/**
 * A change of a reaction to a message: added or withdrawn.
 */
interface MessageReactionEvent extends Event {}
