<?php

declare(strict_types=1);

namespace App\Contracts\Bus;

/**
 * A domain or module that has commands: it lists them, and each has its handler by name beside it in its own folder.
 */
interface CommandProvider
{
    /**
     * @return list<class-string<Command<mixed>>>
     */
    public function commands(): array;
}
