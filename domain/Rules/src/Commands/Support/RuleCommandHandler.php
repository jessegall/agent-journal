<?php

declare(strict_types=1);

namespace Domain\Rules\Commands\Support;

use App\Contracts\Bus\CommandHandler;

/**
 * The base of every Rules handler; the rule lookup they share lives once on the model.
 */
abstract readonly class RuleCommandHandler implements CommandHandler {}
