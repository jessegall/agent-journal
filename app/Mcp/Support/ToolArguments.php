<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\CommandRules\Mcp\Exceptions\ToolArgumentUnknown;
use App\Mcp\Exceptions\ContinuationInvalid;
use App\Mcp\Exceptions\ToolArgumentInvalid;
use App\Support\RecordReference;
use BackedEnum;
use Illuminate\Support\Str;
use Laravel\Mcp\Request;

/**
 * The arguments of one tool call, holding only fields its tool declares, read through typed getters.
 */
final readonly class ToolArguments
{
    /**
     * The first-page arguments a continuation replaces; it carries their values itself.
     */
    private const array FIRST_PAGE_FILTERS = [
        'page',
        'per_page',
        'after_id',
        'limit',
        'search',
        'state',
        'states',
        'view',
        'query',
        'types',
        'section',
        'line_start',
        'line_end',
        'character_offset',
        'revision',
    ];

    /**
     * @param  array<string, mixed>  $arguments
     */
    private function __construct(public array $arguments) {}

    /**
     * @param  array<string, mixed>  $filters
     */
    public static function fromPageFilters(array $filters): self
    {
        return new self($filters);
    }

    /**
     * The request's arguments, refused when one is not among the tool's declared fields.
     *
     * @param  list<string>  $fields
     *
     * @throws ToolArgumentUnknown
     */
    public static function read(string $tool, Request $request, array $fields): self
    {
        return self::within($tool, $request->all(), $fields);
    }

    /**
     * @param  list<string>  $fields
     */
    public static function query(string $resource, Request $request, array $fields): self
    {
        parse_str((string) parse_url((string) $request->uri(), PHP_URL_QUERY), $query);

        return self::within($resource, $query, $fields);
    }

    public static function uriId(Request $request): string
    {
        $path = (string) parse_url((string) $request->uri(), PHP_URL_PATH);

        return new self(['id' => basename($path)])->ulid('id');
    }

    /**
     * @param  array<array-key, mixed>  $arguments
     * @param  list<string>  $fields
     */
    private static function within(string $context, array $arguments, array $fields): self
    {
        $declared = [];

        foreach ($arguments as $name => $argument) {
            if (! is_string($name) || ! in_array($name, $fields, true)) {
                throw ToolArgumentUnknown::for($context, (string) $name);
            }

            $declared[$name] = $argument;
        }

        return new self($declared);
    }

    /**
     * @param  list<string>  $fields
     */
    public function object(string $name, array $fields): self
    {
        $argument = $this->arguments[$name] ?? null;

        if (! is_array($argument) || array_is_list($argument)) {
            throw ToolArgumentInvalid::for($name, 'an object');
        }

        return self::within($name, $argument, $fields);
    }

    /**
     * @param  list<string>  $fields
     */
    public function optionalObject(string $name, array $fields): self|null
    {
        if (array_key_exists($name, $this->arguments)) {
            return $this->object($name, $fields);
        }

        return null;
    }

    public function ulid(string $name): string
    {
        return self::normalizedUlid($name, $this->text($name));
    }

    public function optionalUlid(string $name): string|null
    {
        if (array_key_exists($name, $this->arguments)) {
            return $this->ulid($name);
        }

        return null;
    }

    public function recordReference(string $name): int|string
    {
        $argument = $this->arguments[$name] ?? null;

        if (is_int($argument)) {
            return $this->positiveInteger($name);
        }

        if (is_string($argument) && RecordReference::isNumber($argument)) {
            return (int) $argument;
        }

        return $this->ulid($name);
    }

    /**
     * @return list<string>
     */
    public function optionalList(string $name): array
    {
        if (array_key_exists($name, $this->arguments)) {
            return $this->list($name);
        }

        return [];
    }

    /**
     * @return non-empty-list<string>
     */
    public function ulids(string $name): array
    {
        $ids = $this->list($name);

        if ($ids === []) {
            throw ToolArgumentInvalid::for($name, 'at least one ULID');
        }

        return array_map(fn (string $id) => self::normalizedUlid($name, $id), $ids);
    }

    private static function normalizedUlid(string $name, string $id): string
    {
        if (! Str::isUlid($id)) {
            throw ToolArgumentInvalid::for($name, 'a ULID');
        }

        return strtolower($id);
    }

    /**
     * The continuation the caller sent instead of first-page filters, or null on a first-page read.
     *
     * @throws ContinuationInvalid
     * @throws ToolArgumentInvalid
     */
    public function continuation(): string|null
    {
        if (! array_key_exists('continuation', $this->arguments)) {
            return null;
        }

        foreach (self::FIRST_PAGE_FILTERS as $filter) {
            if (array_key_exists($filter, $this->arguments)) {
                throw ContinuationInvalid::withFilters($filter);
            }
        }

        return $this->text('continuation');
    }

    /**
     * @throws ToolArgumentInvalid
     */
    public function positiveInteger(string $name, int $largest = PHP_INT_MAX): int
    {
        $argument = $this->arguments[$name] ?? null;

        if (! is_int($argument) || $argument < 1 || $argument > $largest) {
            throw ToolArgumentInvalid::for($name, $largest === PHP_INT_MAX ? 'a whole number of at least 1' : sprintf(
                'a whole number from 1 to %s',
                $largest,
            ));
        }

        return $argument;
    }

    /**
     * A whole number that may be zero, such as a version the caller read.
     *
     * @throws ToolArgumentInvalid
     */
    public function wholeNumber(string $name): int
    {
        $argument = $this->arguments[$name] ?? null;

        if (! is_int($argument) || $argument < 0) {
            throw ToolArgumentInvalid::for($name, 'a whole number of at least 0');
        }

        return $argument;
    }

    public function optionalWholeNumber(string $name): int|null
    {
        if (array_key_exists($name, $this->arguments)) {
            return $this->wholeNumber($name);
        }

        return null;
    }

    /**
     * The whole number the caller sent, or the tool's default when it sent none.
     *
     * @throws ToolArgumentInvalid
     */
    public function positiveIntegerOr(string $name, int $default, int $largest = PHP_INT_MAX): int
    {
        if (array_key_exists($name, $this->arguments)) {
            return $this->positiveInteger($name, $largest);
        }

        return $default;
    }

    /**
     * The text the caller sent, or the tool's default when it sent none.
     *
     * @throws ToolArgumentInvalid
     */
    public function textOr(string $name, string $default): string
    {
        if (array_key_exists($name, $this->arguments)) {
            return $this->text($name);
        }

        return $default;
    }

    /**
     * @throws ToolArgumentInvalid
     */
    public function text(string $name): string
    {
        $argument = $this->arguments[$name] ?? null;

        if (! is_string($argument)) {
            throw ToolArgumentInvalid::for($name, 'text');
        }

        return $argument;
    }

    /**
     * Whether the caller set a true/false argument; leaving it out is false.
     *
     * @throws ToolArgumentInvalid
     */
    public function flag(string $name): bool
    {
        if (! array_key_exists($name, $this->arguments)) {
            return false;
        }

        if (! is_bool($this->arguments[$name])) {
            throw ToolArgumentInvalid::for($name, 'true or false');
        }

        return $this->arguments[$name];
    }

    /**
     * The whole number the caller sent, or null when it sent none.
     *
     * @throws ToolArgumentInvalid
     */
    public function optionalPositiveInteger(string $name): int|null
    {
        if (! array_key_exists($name, $this->arguments)) {
            return null;
        }

        if (! is_int($this->arguments[$name])) {
            throw ToolArgumentInvalid::for($name, 'a whole number');
        }

        return $this->arguments[$name];
    }

    /**
     * The text of an argument the caller may leave out, or null when it did.
     *
     * @throws ToolArgumentInvalid
     */
    public function optionalText(string $name): string|null
    {
        if (! array_key_exists($name, $this->arguments)) {
            return null;
        }

        return $this->text($name);
    }

    /**
     * @return list<string>
     *
     * @throws ToolArgumentInvalid
     */
    public function list(string $name): array
    {
        $argument = $this->arguments[$name] ?? null;

        if (! is_array($argument)
            || ! array_is_list($argument)
            || array_filter($argument, is_string(...)) !== $argument
        ) {
            throw ToolArgumentInvalid::for($name, 'a list of texts');
        }

        return $argument;
    }

    /**
     * The values of a list of an enum's cases; a list the caller left out is empty.
     *
     * @template T of BackedEnum
     *
     * @param  class-string<T>  $type
     * @return list<string>
     *
     * @throws ToolArgumentInvalid
     */
    public function enumValues(string $name, string $type): array
    {
        if (! array_key_exists($name, $this->arguments)) {
            return [];
        }

        $caseNames = $this->list($name);

        foreach ($caseNames as $argument) {
            if ($type::tryFrom($argument) === null) {
                throw ToolArgumentInvalid::for($name, 'a list of '.self::valuesOf($type));
            }
        }

        return $caseNames;
    }

    /**
     * A text argument that must be one of the values given.
     *
     * @param  list<string>  $values
     *
     * @throws ToolArgumentInvalid
     */
    public function oneOf(string $name, array $values): string
    {
        $argument = $this->arguments[$name] ?? null;

        if (! is_string($argument) || ! in_array($argument, $values, true)) {
            throw ToolArgumentInvalid::for($name, 'one of '.implode(', ', $values));
        }

        return $argument;
    }

    /**
     * @template T of BackedEnum
     *
     * @param  class-string<T>  $type
     * @return T
     *
     * @throws ToolArgumentInvalid
     */
    public function enum(string $name, string $type): BackedEnum
    {
        $argument = $this->arguments[$name] ?? null;
        $case = is_string($argument) || is_int($argument) ? $type::tryFrom($argument) : null;

        if ($case === null) {
            throw ToolArgumentInvalid::for($name, 'one of '.self::valuesOf($type));
        }

        return $case;
    }

    /**
     * @template T of BackedEnum
     *
     * @param  T  $default
     * @return T
     */
    public function enumOr(string $name, BackedEnum $default): BackedEnum
    {
        if (array_key_exists($name, $this->arguments)) {
            return $this->enum($name, $default::class);
        }

        return $default;
    }

    /**
     * @template T of BackedEnum
     *
     * @param  class-string<T>  $type
     * @return T|null
     */
    public function optionalEnum(string $name, string $type): BackedEnum|null
    {
        if (array_key_exists($name, $this->arguments)) {
            return $this->enum($name, $type);
        }

        return null;
    }

    /**
     * @param  class-string<BackedEnum>  $type
     */
    private static function valuesOf(string $type): string
    {
        return implode(', ', array_map(fn (BackedEnum $case) => (string) $case->value, $type::cases()));
    }
}
