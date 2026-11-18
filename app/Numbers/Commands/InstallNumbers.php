<?php

declare(strict_types=1);

namespace App\Numbers\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Numbers\Handlers\InstallNumbersHandler;

/**
 * Creates the journal's global number group, once; running it again changes nothing.
 *
 * @implements Command<null>
 */
#[HandledBy(InstallNumbersHandler::class)]
final readonly class InstallNumbers implements Command {}
