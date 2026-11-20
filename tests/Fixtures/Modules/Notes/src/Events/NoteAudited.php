<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Events;

use App\Contracts\Event;
use App\Contracts\LogsListenerFailures;

/**
 * A committed note audit whose listeners cannot change the producer's result.
 */
final readonly class NoteAudited implements Event, LogsListenerFailures {}
