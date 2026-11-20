<?php

declare(strict_types=1);

namespace Domain\Chat\Handlers\Support;

use App\Contracts\CommandHandler;

/**
 * The base of every Chat handler; each keeps its own pin and dock rules, which live in one service each.
 */
abstract readonly class ChatCommandHandler implements CommandHandler {}
