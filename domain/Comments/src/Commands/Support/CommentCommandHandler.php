<?php

declare(strict_types=1);

namespace Domain\Comments\Commands\Support;

use App\Contracts\Bus\CommandHandler;

/**
 * The base of every Comments handler.
 */
abstract readonly class CommentCommandHandler implements CommandHandler {}
