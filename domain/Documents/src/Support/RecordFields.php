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
        if (trim($reason) === '') {
            throw ContentMissing::field('reason');
        }

        if (mb_strlen($reason) > self::SETTLEMENT_REASON_CHARACTERS) {
            throw ContentTooLarge::field('reason', self::SETTLEMENT_REASON_CHARACTERS.' characters');
        }

        return trim($reason);
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
        $value = trim($value);

        if ($value === '') {
            throw ContentMissing::field($field);
        }

        if (str_contains($value, "\n") || str_contains($value, "\r")) {
            throw ContentTooLarge::lineBreak($field);
        }

        if (mb_strlen($value) > $maximum) {
            throw ContentTooLarge::field($field, "{$maximum} characters");
        }

        return $value;
    }
}
