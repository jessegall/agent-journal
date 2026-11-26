<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Setup;

/**
 * The line a driver's version probe prints for its pinned build: exactly a text, or starting with one, where {build}
 * stands for the pinned build.
 */
final readonly class VersionLine
{
    private function __construct(private string $text, private bool $isExact) {}

    public static function exactly(string $text): self
    {
        return new self($text, true);
    }

    public static function startingWith(string $text): self
    {
        return new self($text, false);
    }

    /**
     * Whether the trimmed printed line names the build.
     */
    public function accepts(string $printed, string $build): bool
    {
        $expected = str_replace('{build}', $build, $this->text);
        $line = trim($printed);

        if ($this->isExact) {
            return $line === $expected;
        }

        return str_starts_with($line, $expected);
    }
}
