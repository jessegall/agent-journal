<?php

declare(strict_types=1);

namespace Domain\Helpers\Commands\Support;

use App\Contracts\CommandHandler;

/**
 * The base of every Helpers handler; each keeps its own lookups and locks.
 */
abstract readonly class HelperCommandHandler implements CommandHandler {}
