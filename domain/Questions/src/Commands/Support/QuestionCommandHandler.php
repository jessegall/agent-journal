<?php

declare(strict_types=1);

namespace Domain\Questions\Commands\Support;

use App\Contracts\Bus\CommandHandler;

/**
 * The base of every Questions handler.
 */
abstract readonly class QuestionCommandHandler implements CommandHandler {}
