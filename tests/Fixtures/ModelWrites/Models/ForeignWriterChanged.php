<?php

declare(strict_types=1);

namespace Tests\Fixtures\ModelWrites\Models;

use App\Contracts\Event;

/**
 * The event the foreign writer sends from inside the model.
 */
final readonly class ForeignWriterChanged implements Event {}
