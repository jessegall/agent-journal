<?php

declare(strict_types=1);

namespace Domain\Access\Commands\Support;

use App\Contracts\CommandHandler;

/**
 * The base every command handler of Access extends.
 */
abstract readonly class AccessCommandHandler implements CommandHandler {}
