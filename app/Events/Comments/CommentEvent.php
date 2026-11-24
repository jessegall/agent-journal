<?php

declare(strict_types=1);

namespace App\Events\Comments;

use App\Contracts\Events\Event;

/**
 * A fact about comments: every event of that subject extends it, so a listener typed on it hears them all.
 */
abstract readonly class CommentEvent implements Event {}
