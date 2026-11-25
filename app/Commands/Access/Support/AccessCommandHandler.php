<?php

declare(strict_types=1);

namespace App\Commands\Access\Support;

use App\Contracts\Bus\CommandHandler;

/**
 * The base every command handler of Access extends.
 */
abstract readonly class AccessCommandHandler implements CommandHandler {}
