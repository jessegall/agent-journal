<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Events;

use App\Contracts\Event;
use App\Contracts\ListenerFailureLog;

/**
 * A committed note audit whose listeners cannot change the producer's result.
 */
final readonly class NoteAudited implements Event, ListenerFailureLog {}
