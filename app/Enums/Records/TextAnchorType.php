<?php

declare(strict_types=1);

namespace App\Enums\Records;

/**
 * What a text anchor points at: a whole section, a span of lines, or an exact quote within lines.
 */
enum TextAnchorType: string
{
    case Section = 'section';
    case Lines = 'lines';
    case Quote = 'quote';

    /**
     * The anchor type whose fields are exactly these, in their fixed order; none when no type fills them.
     *
     * @param  list<string>  $fields
     */
    public static function filling(array $fields): self|null
    {
        foreach (self::cases() as $type) {
            if ($type->fields() === $fields) {
                return $type;
            }
        }

        return null;
    }

    /**
     * The fields a place of this type fills, in their fixed order.
     *
     * @return list<string>
     */
    public function fields(): array
    {
        return match ($this) {
            self::Section => [
                'version',
                'section',
            ],
            self::Lines => [
                'version',
                'firstLine',
                'lastLine',
            ],
            self::Quote => [
                'version',
                'firstLine',
                'lastLine',
                'quote',
                'startOffset',
                'endOffset',
            ],
        };
    }
}
