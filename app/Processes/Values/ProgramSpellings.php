<?php

declare(strict_types=1);

namespace App\Processes\Values;

/**
 * The spellings one program family declares beside its own name, such as php8.3 for php or phpunit.phar for phpunit.
 * Only a declared spelling maps to the family; nothing is guessed from digits, extensions or hyphens.
 */
final readonly class ProgramSpellings
{
    /**
     * @param  list<string>  $spellings
     */
    public function __construct(public string $family, public array $spellings = []) {}

    public function names(string $name): bool
    {
        return $name === $this->family || in_array($name, $this->spellings, true);
    }

    /**
     * Whether an undeclared name only adds a version or an extension to the family's name, which a proposal could
     * declare.
     */
    public function resembles(string $name): bool
    {
        return ! $this->names($name) && preg_match('/^'.preg_quote($this->family, '/').'(?:[0-9][0-9.]*|\.[a-z]+)$/', $name) === 1;
    }
}
