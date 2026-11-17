<?php

declare(strict_types=1);

namespace App\Domain\Declarations;

use App\Domain\Exceptions\UiPathInvalid;

/**
 * A declared path relative to its domain's prefix, checked to be normalised: lower-case segments or {name}
 * parameters joined by single slashes, with no leading or trailing slash. An empty path is the prefix itself.
 */
final readonly class RoutePath
{
    private const string SEGMENT = '(?:[a-z0-9-]+|\{[a-z_][a-z0-9_]*\})';

    /**
     * @param  list<string>  $parameters
     */
    private function __construct(
        public string $path,
        public array $parameters,
    ) {}

    /**
     * @param  string  $declaration  the full key of the page or action that declares the path
     */
    public static function of(string $declaration, string $path): self
    {
        if ($path !== '' && preg_match('#^'.self::SEGMENT.'(?:/'.self::SEGMENT.')*$#', $path) !== 1) {
            throw UiPathInvalid::notNormalised($declaration, $path);
        }

        preg_match_all('/\{([a-z0-9_]+)\}/', $path, $matches);
        $parameters = $matches[1];

        if (count(array_unique($parameters)) !== count($parameters)) {
            throw UiPathInvalid::parameterTwice($declaration, $path);
        }

        return new self($path, $parameters);
    }

    /**
     * The path with every parameter name left out, so two paths that match the same URLs compare equal.
     */
    public function shape(): string
    {
        return (string) preg_replace('/\{[a-z0-9_]+\}/', '{}', $this->path);
    }

    public function hasParameter(string $name): bool
    {
        return in_array($name, $this->parameters, true);
    }

    /**
     * Whether the given names are exactly the path's parameters, in any order.
     *
     * @param  list<string>  $names
     */
    public function isFilledBy(array $names): bool
    {
        $sortedNames = $names;
        $sortedParameters = $this->parameters;
        sort($sortedNames);
        sort($sortedParameters);

        return $sortedNames === $sortedParameters;
    }
}
