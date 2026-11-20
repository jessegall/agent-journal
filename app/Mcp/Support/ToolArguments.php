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
        'states',
        'view',
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

    /** @param list<string> $fields */
    public function object(string $name, array $fields): self
    {
        $value = $this->arguments[$name] ?? null;

        if (! is_array($value) || array_is_list($value)) {
            throw ToolArgumentInvalid::for($name, 'an object');
        }

        return self::within($name, $value, $fields);
    }

    public function ulid(string $name): string
    {
        $id = $this->text($name);

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
     * @param  class-string<BackedEnum>  $type
     */
    private static function valuesOf(string $type): string
    {
        return implode(', ', array_map(fn (BackedEnum $case): string => (string) $case->value, $type::cases()));
    }
}
