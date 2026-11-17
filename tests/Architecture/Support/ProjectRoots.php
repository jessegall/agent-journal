<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

/**
 * The namespace roots of the project's own code, read from the autoload sections of composer.json.
 */
final readonly class ProjectRoots
{
    /**
     * @param  list<string>  $namespaces
     */
    private function __construct(public array $namespaces) {}

    public static function fromComposer(string $composerPath): self
    {
        $composer = json_decode((string) file_get_contents($composerPath), true, flags: JSON_THROW_ON_ERROR);

        if (! is_array($composer) || ! isset($composer['autoload']['psr-4'], $composer['autoload-dev']['psr-4'])) {
            throw ComposerAutoloadMissing::for($composerPath);
        }

        $namespaces = [
            ...array_keys($composer['autoload']['psr-4']),
            ...array_keys($composer['autoload-dev']['psr-4']),
        ];

        return new self(array_values(array_unique(array_map(strval(...), $namespaces))));
    }

    /**
     * Whether a value, after one optional leading backslash, starts with a project namespace.
     */
    public function startsWithProjectNamespace(string $value): bool
    {
        $name = self::withoutLeadingBackslash($value);

        foreach ($this->namespaces as $namespace) {
            if (stripos($name, $namespace) === 0) {
                return true;
            }
        }

        return false;
    }

    public static function withoutLeadingBackslash(string $value): string
    {
        return str_starts_with($value, '\\') ? substr($value, 1) : $value;
    }
}
