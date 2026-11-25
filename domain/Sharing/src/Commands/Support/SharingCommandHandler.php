<?php

declare(strict_types=1);

namespace Domain\Sharing\Commands\Support;

use App\Contracts\Bus\CommandHandler;

/**
 * The base of every Sharing handler.
 */
abstract readonly class SharingCommandHandler implements CommandHandler {}
