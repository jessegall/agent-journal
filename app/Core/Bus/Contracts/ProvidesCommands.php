<?php

declare(strict_types=1);

namespace App\Core\Bus\Contracts;

/**
 * A domain or module that has commands: it lists them, and each names its handler with HandledBy.
 */
interface ProvidesCommands
{
    /**
     * @return list<class-string<Command<mixed>>>
     */
    public function commands(): array;
}
