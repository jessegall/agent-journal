<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Events\Event;

/**
 * A fact about code reviews, merges, repairs and the reservations of the work they cover: every event of that subject
 * extends it, so a listener typed on it hears them all.
 */
abstract readonly class ReviewEvent implements Event {}
