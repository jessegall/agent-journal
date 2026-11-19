<?php

declare(strict_types=1);

namespace App\Processes\Values\Grammar;

/**
 * A shell option statement to read as a simple command, with the reason it is not supported.
 */
final readonly class OptionStatementReading
{
    public function __construct(public CommandReading $reading, public string $reason) {}
}
