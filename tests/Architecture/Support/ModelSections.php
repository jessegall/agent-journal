<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node\Stmt\ClassMethod;

/**
 * The sections a model's code is divided into by its marker lines, such as // ----------[ Mutations ]----------.
 */
final readonly class ModelSections
{
    public const string MUTATIONS = 'Mutations';

    private const string MARKER = '/^[ \t]*\/\/ -+\[ (\w+) \]-+[ \t]*$/';

    /**
     * @param  array<int, string>  $markers  the section name each marker line opens, by line number
     */
    private function __construct(private array $markers) {}

    public static function of(string $code): self
    {
        $markers = [];

        foreach (explode("\n", $code) as $index => $line) {
            if (preg_match(self::MARKER, $line, $match) === 1) {
                $markers[$index + 1] = $match[1];
            }
        }

        return new self($markers);
    }

    public function isMutation(ClassMethod $method): bool
    {
        $section = null;

        foreach ($this->markers as $line => $name) {
            if ($line < $method->getStartLine()) {
                $section = $name;
            }
        }

        return $section === self::MUTATIONS;
    }
}
