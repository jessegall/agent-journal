<?php

declare(strict_types=1);

namespace App\CommandRules\Values;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * The spellings one program family declares beside its own name, such as php8.3 for php or phpunit.phar for phpunit.
 * Only a declared spelling maps to the family; nothing is guessed from digits, extensions or hyphens.
 */
#[MapName(SnakeCaseMapper::class)]
final class ProgramSpellings extends Data
{
    /**
     * @param  list<string>  $spellings
     */
    public function __construct(public readonly string $family, public readonly array $spellings = []) {}

    /**
     * PHP under each versioned name a system installs it as.
     */
    public static function php(): self
    {
        return new self('php', ['php8.1', 'php8.2', 'php8.3', 'php8.4', 'php8.5', 'php8.6']);
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
