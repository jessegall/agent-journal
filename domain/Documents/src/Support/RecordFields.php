<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Text\Exceptions\ContentMissing;
use App\Text\Exceptions\ContentTooLarge;

/**
 * The limits of a document's and a report's own fields: its title, its abstract and the reason it is settled. The body is Core text (App\Text\Support\MarkdownText).
 */
final class RecordFields
{
    public const int TITLE_CHARACTERS = 200;

    public const int SETTLEMENT_REASON_CHARACTERS = 2000;

    public const int ABSTRACT_CHARACTERS = 500;

    /**
     * Why a record is settled: not only whitespace, and at most SETTLEMENT_REASON_CHARACTERS long.
     *
     * @throws ContentMissing|ContentTooLarge
     */
    public static function settlementReason(string $reason): string
    {
        return self::text('reason', $reason, self::SETTLEMENT_REASON_CHARACTERS);
    }

    /**
     * @throws ContentMissing|ContentTooLarge
     */
    public static function title(string $title): string
    {
        return self::line('title', $title, self::TITLE_CHARACTERS);
    }

    /**
     * @throws ContentMissing|ContentTooLarge
     */
    public static function abstract(string $abstract): string
    {
        return self::line('abstract', $abstract, self::ABSTRACT_CHARACTERS);
    }

    /**
     * @throws ContentMissing|ContentTooLarge
     */
    private static function line(string $field, string $value, int $maximum): string
    {
        if (str_contains(trim($value), "\n") || str_contains(trim($value), "\r")) {
            throw ContentTooLarge::lineBreak($field);
        }

        return self::text($field, $value, $maximum);
    }

    /**
     * The trimmed text: not empty and at most the maximum number of characters long.
     *
     * @throws ContentMissing|ContentTooLarge
     */
    private static function text(string $field, string $value, int $maximum): string
    {
        $trimmed = trim($value);

        if ($trimmed === '') {
            throw ContentMissing::field($field);
        }

        if (mb_strlen($trimmed) > $maximum) {
            throw ContentTooLarge::field($field, "{$maximum} characters");
        }

        return $trimmed;
    }
}
