<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Events;

use App\Contracts\Events\Event;
use App\Sessions\Contracts\Events\ListenerFailureLog;

/**
 * A committed note audit whose listeners cannot change the producer's result.
 */
final readonly class NoteAudited implements Event, ListenerFailureLog {}
