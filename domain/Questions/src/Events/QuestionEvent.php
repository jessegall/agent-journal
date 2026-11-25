<?php

declare(strict_types=1);

namespace Domain\Questions\Events;

use App\Contracts\Events\Event;

/**
 * A fact about a question: every event of that subject extends it, so a listener typed on it hears them all.
 */
abstract readonly class QuestionEvent implements Event {}
