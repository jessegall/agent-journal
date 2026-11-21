<?php

declare(strict_types=1);

namespace App\Ui\Enums;

/**
 * The parts a declared layout may hold, as they cross the page wire, with what each accepts: its sizes and
 * styles, default first, and whether it holds children: box, text, collection, notice, action, field and form.
 */
enum LayoutTag: string
{
    case Box = 'box';
    case Text = 'text';
    case Collection = 'collection';
    case Notice = 'notice';
    case Action = 'action';
    case Field = 'field';
    case Form = 'form';

    /**
     * The sizes the part takes, the default first; none for a part that takes no size.
     *
     * @return list<string>
     */
    public function sizes(): array
    {
        return match ($this) {
            self::Box, self::Collection => ['normal', 'compact'],
            self::Text, self::Action => ['normal', 'small', 'large'],
            self::Field => ['normal'],
            self::Notice, self::Form => [],
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
            self::Box => ['stack', 'row', 'section', 'card', 'panel', 'header', 'group', 'divider', 'split'],
            self::Text => ['plain', 'heading', 'muted', 'badge', 'code', 'keyHint', 'paragraph'],
            self::Collection => ['list', 'facts'],
            self::Notice => ['info', 'success', 'warning', 'error', 'empty', 'refusal'],
            self::Action => ['bordered', 'ghost', 'primary', 'danger'],
            self::Field => ['search', 'text'],
            self::Form => ['stack', 'inline'],
        };
    }

    /**
     * Whether a part of this tag and style holds child parts: a form and a box do, but a divider box does not.
     */
    public function holdsChildren(string $style): bool
    {
        return $this === self::Form || $this === self::Box && $style !== 'divider';
    }
}
