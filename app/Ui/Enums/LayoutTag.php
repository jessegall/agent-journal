<?php

declare(strict_types=1);

namespace App\Ui\Enums;

/**
 * The parts a declared layout may hold, as they cross the page wire, with what each accepts: its sizes and
 * styles, default first, and whether it holds children. The first catalogue is box, text, collection and notice.
 */
enum LayoutTag: string
{
    case Box = 'box';
    case Text = 'text';
    case Collection = 'collection';
    case Notice = 'notice';

    /**
     * The sizes the part takes, the default first; none for a part that takes no size.
     *
     * @return list<string>
     */
    public function sizes(): array
    {
        return match ($this) {
            self::Box, self::Collection => ['normal', 'compact'],
            self::Text => ['normal', 'small', 'large'],
            self::Notice => [],
        };
    }

    /**
     * The styles the part takes, the default first.
     *
     * @return list<string>
     */
    public function styles(): array
    {
        return match ($this) {
            self::Box => ['stack', 'row', 'section', 'card', 'panel', 'header', 'group', 'divider'],
            self::Text => ['plain', 'heading', 'muted', 'badge', 'code', 'keyHint'],
            self::Collection => ['list', 'facts'],
            self::Notice => ['info', 'success', 'warning', 'error', 'empty', 'refusal'],
        };
    }

    /**
     * Whether a part of this tag and style holds child parts: a box does, but a divider box does not.
     */
    public function holdsChildren(string $style): bool
    {
        return $this === self::Box && $style !== 'divider';
    }
}
