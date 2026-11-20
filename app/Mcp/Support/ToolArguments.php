<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Mcp\Exceptions\ContinuationInvalid;
use App\Mcp\Exceptions\ToolArgumentInvalid;
use App\Mcp\Exceptions\ToolArgumentUnknown;
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
     * @param list<string> $fields
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

        foreach ($arguments as $name => $value) {
            if (! is_string($name) || ! in_array($name, $fields, true)) {
                throw ToolArgumentUnknown::for($context, (string) $name);
            }

            $declared[$name] = $value;
        }

        return new self($declared);
    }

    /**
     * @param list<string> $fields
     */
    public function object(string $name, array $fields): self
    {
        $value = $this->arguments[$name] ?? null;

        if (! is_array($value) || array_is_list($value)) {
            throw ToolArgumentInvalid::for($name, 'an object');
        }

        return self::within($name, $value, $fields);
    }

    /**
     * @param list<string> $fields
     */
    public function optionalObject(string $name, array $fields): self|null
    {
        return array_key_exists($name, $this->arguments) ? $this->object($name, $fields) : null;
    }

    public function ulid(string $name): string
    {
        return self::normalizedUlid($name, $this->text($name));
    }

    public function optionalUlid(string $name): string|null
    {
        return array_key_exists($name, $this->arguments) ? $this->ulid($name) : null;
    }

    public function recordReference(string $name): int|string
    {
        $value = $this->arguments[$name] ?? null;
        if (is_int($value)) {
            return $this->positiveInteger($name);
        }
        if (is_string($value) && preg_match('/^[1-9][0-9]{0,18}$/', $value) === 1
            && (strlen($value) < 19 || strcmp($value, (string) PHP_INT_MAX) <= 0)) {
            return (int) $value;
        }

        return $this->ulid($name);
    }

    /**
     * @return list<string>
     */
    public function optionalList(string $name): array
    {
        return array_key_exists($name, $this->arguments) ? $this->list($name) : [];
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
        $value = $this->arguments[$name] ?? null;

        if (! is_int($value) || $value < 1 || $value > $largest) {
            throw ToolArgumentInvalid::for($name, $largest === PHP_INT_MAX ? 'a whole number of at least 1' : sprintf(
                'a whole number from 1 to %s',
                $largest,
            ));
        }

        return $value;
    }

    /**
     * A whole number that may be zero, such as a version the caller read.
     *
     * @throws ToolArgumentInvalid
     */
    public function wholeNumber(string $name): int
    {
        $value = $this->arguments[$name] ?? null;

        if (! is_int($value) || $value < 0) {
            throw ToolArgumentInvalid::for($name, 'a whole number of at least 0');
        }

        return $value;
    }

    public function optionalWholeNumber(string $name): int|null
    {
        return array_key_exists($name, $this->arguments) ? $this->wholeNumber($name) : null;
    }

    /**
     * The whole number the caller sent, or the tool's default when it sent none.
     *
     * @throws ToolArgumentInvalid
     */
    public function positiveIntegerOr(string $name, int $default, int $largest = PHP_INT_MAX): int
    {
        return array_key_exists($name, $this->arguments) ? $this->positiveInteger($name, $largest) : $default;
    }

    /**
     * The text the caller sent, or the tool's default when it sent none.
     *
     * @throws ToolArgumentInvalid
     */
    public function textOr(string $name, string $default): string
    {
        return array_key_exists($name, $this->arguments) ? $this->text($name) : $default;
    }

    /**
     * @throws ToolArgumentInvalid
     */
    public function text(string $name): string
    {
        $value = $this->arguments[$name] ?? null;

        if (! is_string($value)) {
            throw ToolArgumentInvalid::for($name, 'text');
        }

        return $value;
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
        $value = $this->arguments[$name] ?? null;

        if (! is_array($value) || ! array_is_list($value) || array_filter($value, is_string(...)) !== $value) {
            throw ToolArgumentInvalid::for($name, 'a list of texts');
        }

        return $value;
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

        $values = $this->list($name);

        foreach ($values as $value) {
            if ($type::tryFrom($value) === null) {
                throw ToolArgumentInvalid::for($name, 'a list of '.self::valuesOf($type));
            }
        }

        return $values;
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
        $value = $this->arguments[$name] ?? null;
        $case = is_string($value) || is_int($value) ? $type::tryFrom($value) : null;

        if ($case === null) {
            throw ToolArgumentInvalid::for($name, 'one of '.self::valuesOf($type));
        }

        return $case;
    }

    /**
     * @template T of BackedEnum
     * @param T $default
     * @return T
     */
    public function enumOr(string $name, BackedEnum $default): BackedEnum
    {
        return array_key_exists($name, $this->arguments) ? $this->enum($name, $default::class) : $default;
    }

    /**
     * @template T of BackedEnum
     * @param class-string<T> $type
     * @return T|null
     */
    public function optionalEnum(string $name, string $type): BackedEnum|null
    {
        return array_key_exists($name, $this->arguments) ? $this->enum($name, $type) : null;
    }

    /**
     * @param  class-string<BackedEnum>  $type
     */
    private static function valuesOf(string $type): string
    {
        return implode(', ', array_map(fn (BackedEnum $case): string => (string) $case->value, $type::cases()));
    }
}
