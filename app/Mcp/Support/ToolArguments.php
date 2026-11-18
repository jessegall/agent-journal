<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Mcp\Exceptions\ContinuationInvalid;
use App\Mcp\Exceptions\ToolArgumentInvalid;
use App\Mcp\Exceptions\ToolArgumentUnknown;
use BackedEnum;
use Laravel\Mcp\Request;

/**
 * The arguments of one tool call, holding only fields its tool declares, read through typed getters.
 */
final readonly class ToolArguments
{
    /**
     * The first-page arguments a continuation replaces; it carries their values itself.
     */
    private const array FIRST_PAGE_FILTERS = ['page', 'per_page', 'after_id', 'limit', 'search', 'states', 'view', 'section', 'line_start', 'line_end', 'character_offset', 'revision'];

    /**
     * @param  array<string, mixed>  $arguments
     */
    private function __construct(private array $arguments) {}

    /**
     * The request's arguments, refused when one is not among the tool's declared fields.
     *
     * @param  list<string>  $fields
     *
     * @throws ToolArgumentUnknown
     */
    public static function read(string $tool, Request $request, array $fields): self
    {
        $arguments = $request->all();

        foreach (array_keys($arguments) as $name) {
            if (! in_array($name, $fields, true)) {
                throw ToolArgumentUnknown::for($tool, (string) $name);
            }
        }

        return new self($arguments);
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
    public function positiveInteger(string $name): int
    {
        $value = $this->arguments[$name] ?? null;

        if (! is_int($value) || $value < 1) {
            throw ToolArgumentInvalid::for($name, 'a whole number of at least 1');
        }

        return $value;
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
            $values = implode(', ', array_map(fn (BackedEnum $case): string => (string) $case->value, $type::cases()));

            throw ToolArgumentInvalid::for($name, "one of {$values}");
        }

        return $case;
    }
}
