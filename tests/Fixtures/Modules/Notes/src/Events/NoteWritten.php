<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Events;

use App\Contracts\Event;

/**
 * A note was written in the fixture module.
 */
final readonly class NoteWritten implements Event {}
