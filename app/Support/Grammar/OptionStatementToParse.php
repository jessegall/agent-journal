<?php

declare(strict_types=1);

namespace App\Support\Grammar;

/**
 * A shell option statement to read as a simple command, with the reason it is not supported.
 */
final readonly class OptionStatementToParse
{
    public function __construct(public CommandToParse $toParse, public string $reason) {}
}
