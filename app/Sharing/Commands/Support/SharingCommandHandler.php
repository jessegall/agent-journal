<?php

declare(strict_types=1);

namespace App\Sharing\Commands\Support;

use App\Bus\Contracts\CommandHandler;

/**
 * The base of every Sharing handler.
 */
abstract readonly class SharingCommandHandler implements CommandHandler {}
