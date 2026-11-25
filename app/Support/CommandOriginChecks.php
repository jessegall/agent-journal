<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Bus\Command;
use App\Enums\Engine\CommandOriginStatus;
use Closure;
use Illuminate\Container\Attributes\Scoped;

/**
 * Supplies the innermost submitted command's origin check to its transaction.
 */
#[Scoped]
final class CommandOriginChecks
{
    /**
     * @var list<CommandOriginCheck>
     */
    private array $active = [];

    /**
     * @param  Closure(): mixed  $dispatch
     */
    public function during(CommandOriginCheck $check, Closure $dispatch): CommandOriginStatus
    {
        $this->active[] = $check;

        try {
            $dispatch();

            return $check->status();
        } finally {
            array_pop($this->active);
        }
    }

    /**
     * @param  Command<mixed>  $command
     */
    public function permits(Command $command): bool
    {
        $check = $this->active[array_key_last($this->active) ?? -1] ?? null;

        return $check === null || $check->permits($command);
    }
}
