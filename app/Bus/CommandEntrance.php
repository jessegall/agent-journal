<?php

declare(strict_types=1);

namespace App\Bus;

use App\Accounts\Enums\CommandEntry;
use Closure;
use Illuminate\Container\Attributes\Scoped;

/**
 * The entry the command running now was dispatched through; the application's own, unless a trusted entry's
 * dispatcher opened its own for the work it runs.
 */
#[Scoped]
final class CommandEntrance
{
    /**
     * @var list<CommandEntry> innermost last
     */
    private array $entryStack = [];

    /**
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function through(CommandEntry $entry, Closure $work): mixed
    {
        $this->entryStack[] = $entry;

        try {
            return $work();
        } finally {
            array_pop($this->entryStack);
        }
    }

    /**
     * Whether trusted work opened the application's entrance for the commands it runs, as a tick does for its work.
     */
    public function isOpenedForApplication(): bool
    {
        return ($this->entryStack[array_key_last($this->entryStack) ?? -1] ?? null) === CommandEntry::Application;
    }

    /**
     * Whether a command of the entry may run here: an application command when nothing trusted is open, otherwise
     * a command of any entry open now, so a tick inside an engine pass runs both.
     */
    public function admits(CommandEntry $entry): bool
    {
        if ($this->entryStack === []) {
            return $entry === CommandEntry::Application;
        }

        return in_array($entry, $this->entryStack, true);
    }

    public function current(): CommandEntry
    {
        return $this->entryStack[array_key_last($this->entryStack) ?? -1] ?? CommandEntry::Application;
    }
}
