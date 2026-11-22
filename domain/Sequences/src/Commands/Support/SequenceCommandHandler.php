<?php

declare(strict_types=1);

namespace Domain\Sequences\Commands\Support;

use App\Contracts\Bus\CommandHandler;

/**
 * The base of every Sequences handler.
 */
abstract readonly class SequenceCommandHandler implements CommandHandler {}
