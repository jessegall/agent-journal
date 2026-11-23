<?php

declare(strict_types=1);

namespace App\Support\Layout;

/**
 * One group of settings: a heading, its help, its rows and, where the declaration permits it, a Reset form that
 * carries the revision the group was read at, so a group changed meanwhile is refused instead of overwritten. Editable
 * rows share one form that sends them to the group's registered save.
 */
final readonly class SettingsGroup
{
    /**
     * @param  list<SettingsRow>  $rows
     */
    private function __construct(
        private string $key,
        private string $title,
        private string|null $help,
        private array $rows,
        private LayoutFormData|null $save,
        private LayoutFormData|null $reset,
    ) {}

    public static function make(string $key, string $title, string|null $help = null): self
    {
        return new self($key, $title, $help, [], null, null);
    }

    public function withRows(SettingsRow ...$rows): self
    {
        return new self($this->key, $this->title, $this->help, array_values($rows), $this->save, $this->reset);
    }

    /**
     * The registered save the group's editable rows are sent to.
     */
    public function savingTo(LayoutFormData $save): self
    {
        return new self($this->key, $this->title, $this->help, $this->rows, $save, $this->reset);
    }

    /**
     * The Reset the viewer may use: a form whose fixed values hold the revision the group was read at. When the
     * form carries an undo, an authorized restore checked against the revision after the reset, a toast offers it.
     */
    public function resettableBy(LayoutFormData $reset): self
    {
        return new self($this->key, $this->title, $this->help, $this->rows, $this->save, $reset);
    }

    public function part(): LayoutPartData
    {
        $parts = [LayoutPartData::text('title', $this->title, 'heading')];

        if ($this->help !== null) {
            $parts[] = LayoutPartData::text('help', $this->help, 'muted');
        }

        if ($this->reset instanceof LayoutFormData) {
            $parts[] = LayoutPartData::form(
                'reset',
                $this->reset,
                'inline',
                LayoutPartData::action('reset-send', 'Reset', LayoutActionData::submitting()),
            );
        }

        $rows = array_map(fn (SettingsRow $row) => $row->part(), $this->rows);

        $parts[] = LayoutPartData::box('rows', 'settings-group', ...$this->editable($rows));

        return LayoutPartData::box($this->key, 'settings', ...$parts);
    }

    /**
     * @param  list<LayoutPartData>  $rows
     * @return list<LayoutPartData>
     */
    private function editable(array $rows): array
    {
        if (! $this->save instanceof LayoutFormData) {
            return $rows;
        }

        return [
            LayoutPartData::form(
                'form',
                $this->save,
                'stack',
                ...[
                    ...$rows,
                    LayoutPartData::box(
                        'save-row',
                        'settings-footer',
                        LayoutPartData::action('save', 'Save', LayoutActionData::submitting(), 'primary'),
                    ),
                ],
            ),
        ];
    }
}
