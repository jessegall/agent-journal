<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Records\Support\RecordIdentity;

/**
 * The account a start of a program runs with: its record by identity, the sign-in generation it is in and the private
 * folder the program reads its sign-in from. It never leaves the server and holds no secret itself.
 */
final readonly class SelectedAccount
{
    public function __construct(
        public RecordIdentity $record,
        public string $program,
        public string $directory,
        public int $generation,
    ) {}
}
