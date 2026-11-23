<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * The parts a declared layout may hold, as they cross the page wire, with what each accepts: its sizes and
 * styles, default first, and whether it holds children: box, text, collection, notice, action, field, form, tabs,
 * body, native, menu, progress and dialog.
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
    case Tabs = 'tabs';
    case Body = 'body';
    case Native = 'native';
    case Menu = 'menu';
    case Progress = 'progress';
    case Dialog = 'dialog';

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
            self::Notice, self::Form, self::Tabs, self::Body => [],
            self::Native, self::Menu, self::Progress, self::Dialog => [],
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
            self::Box => [
                'stack', 'row', 'section', 'card', 'panel', 'header', 'group', 'divider', 'split', 'bar', 'reader',
                'settings-page', 'settings', 'settings-group', 'setting', 'setting-block', 'settings-footer',
                'page-head', 'page', 'page-list', 'page-empty',
            ],
            self::Text => [
                'plain',
                'heading',
                'muted',
                'badge',
                'code',
                'keyHint',
                'paragraph',
                'time',
                'chip',
                'icon',
                'driver',
                'spoken',
            ],
            self::Collection => ['list', 'facts', 'choices'],
            self::Notice => ['info', 'success', 'warning', 'error', 'empty', 'first', 'refusal', 'skeleton', 'stale'],
            self::Action => ['bordered', 'ghost', 'primary', 'danger'],
            self::Field => ['search', 'text', 'secret', 'toggle', 'area', 'choice'],
            self::Form => ['stack', 'inline', 'live'],
            self::Tabs => ['tabs'],
            self::Body => ['prose'],
            self::Native => ['native'],
            self::Menu => ['dropdown'],
            self::Progress => ['meter', 'counted', 'share', 'usage', 'usage-row'],
            self::Dialog => ['dialog'],
        };
    }

    /**
     * Whether a part of this tag and style holds child parts: a form, a tab set (its shown tab) and a box do, but a
     * divider box does not.
     */
    public function holdsChildren(string $style): bool
    {
        return $this === self::Form
            || $this === self::Tabs
            || $this === self::Dialog
            || $this === self::Box && $style !== 'divider';
    }
}
