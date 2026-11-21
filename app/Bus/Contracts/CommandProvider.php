<?php

declare(strict_types=1);

namespace App\Bus\Contracts;

/**
 * A domain or module that has commands: it lists them, and each has its handler by name in the Handlers folder.
 */
interface CommandProvider
{
    /**
     * @return list<class-string<Command<mixed>>>
     */
    public function commands(): array;
}
