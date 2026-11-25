<?php

declare(strict_types=1);

namespace Domain\Sharing\Events;

use App\Contracts\Events\Event;

/**
 * A fact about shares and the gateway that serves them: every event of that subject extends it, so a listener typed on
 * it hears them all.
 */
abstract readonly class ShareEvent implements Event {}
