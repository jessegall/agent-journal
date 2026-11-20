<?php

declare(strict_types=1);

namespace Domain\Memory\Handlers\Support;

use App\Contracts\CommandHandler;

/**
 * The base of every Memory handler; editing keeps its own revision check.
 */
abstract readonly class MemoryCommandHandler implements CommandHandler {}
