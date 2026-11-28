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
    /** @use \App\Web\Creation\Buildable<SettingsGroupFields> */
    use \App\Web\Creation\Buildable;

    protected const string FIELDS = SettingsGroupFields::class;

    /**
     * @param  list<SettingsRow>  $rows
     */
    public function __construct(
        private string $key,
        private string $title,
        private string|null $help,
        private array $rows,
        private LayoutFormData|null $save,
        private LayoutFormData|null $reset,
        private LayoutPartData|null $switch,
        private bool $isLeading = false,
    ) {}

    public static function page(self ...$groups): DeclaredLayoutData
    {
        return DeclaredLayoutData::build()
            ->root(
                LayoutPartData::build()
                ->asBox()
                ->key('settings')
                ->style('page')
                ->children(
                    LayoutPartData::build()
                    ->asBox()
                    ->key('header')
                    ->style('page-head')
                    ->children(
                        LayoutPartData::build()
                        ->asText()
                        ->key('title')
                        ->value('Settings')
                        ->style('heading')
                        ->finish(),
                    )
                    ->finish(),
                    LayoutPartData::build()
                    ->asBox()
                    ->key('settings-page')
                    ->style('settings-page')
                    ->children(...array_map(fn (self $group) => $group->part(), $groups))
                    ->finish(),
                )
                ->finish(),
            )
            ->finish();
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
        $toggle = LayoutPartData::build()
            ->asField()
            ->key($field->name)
            ->label($this->title)
            ->field($field)
            ->style('toggle')
            ->finish();

        return clone ($this, ['switch' => LayoutPartData::build()
            ->asForm()
            ->key('switch')
            ->form($form)
            ->style('live')
            ->children($toggle)
            ->finish()]);
    }

    public function part(): LayoutPartData
    {
        $parts = [LayoutPartData::build()
            ->asText()
            ->key('title')
            ->value($this->title)
            ->style($this->isLeading ? 'spoken' : 'heading')
            ->finish()];

        if ($this->help !== null) {
            $parts[] = LayoutPartData::build()
                ->asText()
                ->key('help')
                ->value($this->help)
                ->style('muted')
                ->finish();
        }

        if ($this->reset instanceof LayoutFormData) {
            $parts[] = LayoutPartData::build()
                ->asForm()
                ->key('reset')
                ->form($this->reset)
                ->style('inline')
                ->children(
                    LayoutPartData::build()
                    ->asAction()
                    ->key('reset-send')
                    ->label('Reset')
                    ->action(LayoutActionData::build()->submits(true)->finish())
                    ->finish(),
                )
                ->finish();
        }

        if ($this->switch instanceof LayoutPartData) {
            $parts[] = $this->switch;
        }

        if ($this->rows !== []) {
            $rows = array_map(fn (SettingsRow $row) => $row->part(), $this->rows);
            $parts[] = LayoutPartData::build()
                ->asBox()
                ->key('rows')
                ->style('settings-group')
                ->children(...$this->editable($rows))
                ->finish();
        }

        return LayoutPartData::build()
            ->asBox()
            ->key($this->key)
            ->style('settings')
            ->children(...$parts)
            ->finish();
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

        return [LayoutPartData::build()
            ->asForm()
            ->key('form')
            ->form($this->save)
            ->style('live')
            ->children(...$rows)
            ->finish()];
    }
}
