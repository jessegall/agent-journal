<?php

declare(strict_types=1);

namespace App\Support;

use App\Exceptions\InvalidRecordReference;
use Illuminate\Support\Str;

/**
 * A record as users name it: its type and its number, and for a record numbered within a parent the parent's
 * reference too, such as 'plan 12, phase 2'. One parser reads every number users type.
 */
final readonly class RecordReference
{
    private function __construct(public string $type, public int $number, public RecordReference|null $parent) {}

    /**
     * A record numbered across the journal, such as task 47.
     */
    public static function of(string $type, int $number): self
    {
        return new self($type, $number, null);
    }

    /**
     * A record numbered within its parent, such as phase 2 of plan 12.
     */
    public static function within(self $parent, string $type, int $number): self
    {
        return new self($type, $number, $parent);
    }

    /**
     * Reads 'plan 12' or 'task 47'; a phase is read with its plan through within().
     *
     * @throws InvalidRecordReference
     */
    public static function parse(string $text): self
    {
        if (preg_match('/^([a-z][a-z-]*) (\S+)$/', $text, $parts) !== 1) {
            throw InvalidRecordReference::unreadable($text);
        }

        return self::of($parts[1], self::number($parts[2]));
    }

    /**
     * A record number: a positive whole number within the signed bigint range, written without sign, leading zeros,
     * exponent or spaces.
     *
     * @throws InvalidRecordReference
     */
    public static function number(string $text): int
    {
        if (! self::isNumber($text)) {
            throw InvalidRecordReference::number($text);
        }

        return (int) $text;
    }

    /**
     * Whether the text is a record number: positive decimal digits with no leading zero that fit in an integer.
     */
    public static function isNumber(string $text): bool
    {
        $isPositiveNumber = preg_match('/^[1-9][0-9]{0,18}$/', $text) === 1;

        return $isPositiveNumber && (strlen($text) < 19 || strcmp($text, (string) PHP_INT_MAX) <= 0);
    }

    public static function idOrNumber(string $text): int|string
    {
        if (Str::isUlid($text)) {
            return strtolower($text);
        }

        return self::number($text);
    }

    /**
     * How users read it, such as 'plan 12', or 'plan 12, phase 2' for a record within a parent.
     */
    public function label(): string
    {
        $own = "{$this->type} {$this->number}";

        if ($this->parent === null) {
            return $own;
        }

        return "{$this->parent->label()}, {$own}";
    }
}
