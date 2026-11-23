<?php

declare(strict_types=1);

namespace App\Support\Layout;

/**
 * One group of settings: a heading, its help, its rows and, where the declaration permits it, a switch beside the
 * heading and a Reset form, each carrying the revision the group was read at, so a group changed meanwhile is refused
 * instead of overwritten. Editable rows share one form that sends a change to the group's registered save as it is made.
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
        private LayoutPartData|null $switch,
        private bool $isLeading = false,
    ) {}

    public static function make(string $key, string $title, string|null $help = null): self
    {
        return new self($key, $title, $help, [], null, null, null);
    }

    /**
     * The first group of a reader, which stands right under the reader's title: its own title names the region for a
     * screen reader and is not drawn.
     */
    public function leading(): self
    {
        return clone ($this, ['isLeading' => true]);
    }

    public function withRows(SettingsRow ...$rows): self
    {
        return clone ($this, ['rows' => array_values($rows)]);
    }

    /**
     * The registered save the group's editable rows are sent to.
     */
    public function savingTo(LayoutFormData $save): self
    {
        return clone ($this, ['save' => $save]);
    }

    /**
     * The Reset the viewer may use: a form whose fixed values hold the revision the group was read at. When the
     * form carries an undo, an authorized restore checked against the revision after the reset, a toast offers it.
     */
    public function resettableBy(LayoutFormData $reset): self
    {
        return clone ($this, ['reset' => $reset]);
    }

    /**
     * The switch beside the heading that turns the whole group on or off: one field sent to its form when flipped.
     */
    public function switchedBy(LayoutFormData $form, LayoutFieldData $field): self
    {
        $toggle = LayoutPartData::field($field->name, $this->title, $field, 'toggle');

        return clone ($this, ['switch' => LayoutPartData::form('switch', $form, 'live', $toggle)]);
    }

    public function part(): LayoutPartData
    {
        $parts = [LayoutPartData::text('title', $this->title, $this->isLeading ? 'spoken' : 'heading')];

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

        if ($this->switch instanceof LayoutPartData) {
            $parts[] = $this->switch;
        }

        if ($this->rows !== []) {
            $rows = array_map(fn (SettingsRow $row) => $row->part(), $this->rows);
            $parts[] = LayoutPartData::box('rows', 'settings-group', ...$this->editable($rows));
        }

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

        return [LayoutPartData::form('form', $this->save, 'live', ...$rows)];
    }
}
