<?php

declare(strict_types=1);

namespace Domain\Memory\Commands\Support;

use App\Contracts\Bus\CommandHandler;

/**
 * The base of every Memory handler; editing keeps its own revision check.
 */
abstract readonly class MemoryCommandHandler implements CommandHandler {}
