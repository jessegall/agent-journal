<?php

declare(strict_types=1);

namespace App\Values;

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

    /**
     * PHP under each versioned name a system installs it as.
     */
    public static function php(): self
    {
        return new self('php', [
            'php8.1',
            'php8.2',
            'php8.3',
            'php8.4',
            'php8.5',
            'php8.6',
        ]);
    }

    /**
     * @return array{family: string, spellings: list<string>}
     */
    public function toArray(): array
    {
        return [
            'family' => $this->family,
            'spellings' => $this->spellings,
        ];
    }

    /**
     * @param  array{family: string, spellings: list<string>}  $fields
     */
    public static function fromArray(array $fields): self
    {
        return new self($fields['family'], $fields['spellings']);
    }

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
        $pattern = '/^'.preg_quote($this->family, '/').'(?:[0-9][0-9.]*|\.[a-z]+)$/';

        return ! $this->names($name) && preg_match($pattern, $name) === 1;
    }
}
