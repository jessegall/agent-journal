<?php

declare(strict_types=1);

namespace App\Access\Commands\Support;

use App\Bus\Contracts\CommandHandler;

/**
 * The base every command handler of Access extends.
 */
abstract readonly class AccessCommandHandler implements CommandHandler {}
