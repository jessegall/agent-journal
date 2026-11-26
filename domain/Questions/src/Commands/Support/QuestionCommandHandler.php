<?php

declare(strict_types=1);

namespace Domain\Questions\Commands\Support;

use App\Bus\Contracts\CommandHandler;

/**
 * The base of every Questions handler.
 */
abstract readonly class QuestionCommandHandler implements CommandHandler {}
