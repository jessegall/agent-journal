<?php

declare(strict_types=1);

namespace App\Support\Layout;

/**
 * One setting of a group: its label and help, a changed flag, and either one form field or a read-only value; a block
 * row puts its value below the label, for chips, code and long paths that wrap.
 */
final readonly class SettingsRow
{
    private function __construct(
        private string $key,
        private string $label,
        private string|null $help,
        private LayoutPartData $control,
        private bool $isBlock = false,
        private bool $isChanged = false,
    ) {}

    /**
     * A row whose value is edited in a text field, a secret field, a choice or, only where declared, a switch.
     *
     * @param  'text'|'secret'|'toggle'|'choice'  $style
     */
    public static function field(
        string $key,
        string $label,
        LayoutFieldData $field,
        string $style = 'text',
        string|null $help = null,
    ): self {
        return new self($key, $label, $help, LayoutPartData::build()
            ->asField()
            ->key($key)
            ->label($label)
            ->field($field)
            ->style($style)
            ->finish());
    }

    /**
     * A row with a read-only value.
     */
    public static function value(string $key, string $label, string $value, string|null $help = null): self
    {
        return new self($key, $label, $help, LayoutPartData::build()
            ->asText()
            ->key($key)
            ->value($value)
            ->finish());
    }

    /**
     * A row with a read-only value in declared code text, such as a path or a script, drawn as a block.
     */
    public static function code(string $key, string $label, string $value, string|null $help = null): self
    {
        return new self($key, $label, $help, LayoutPartData::build()
            ->asText()
            ->key($key)
            ->value($value)
            ->style('code')
            ->finish(), true);
    }

    /**
     * A row whose value is a part the caller built, such as an action, beside its label.
     */
    public static function control(string $key, string $label, LayoutPartData $control, string|null $help = null): self
    {
        return new self($key, $label, $help, $control);
    }

    /**
     * A block row whose value is a part the caller built, such as a measured reading, below its label.
     */
    public static function reading(string $key, string $label, LayoutPartData $control, string|null $help = null): self
    {
        return new self($key, $label, $help, $control, true);
    }

    /**
     * A row whose value is a few words drawn as chips, below its label.
     *
     * @param  list<string>  $chips
     */
    public static function chips(string $key, string $label, array $chips, string|null $help = null): self
    {
        $parts = array_map(
            fn (int $index) => LayoutPartData::build()
                ->asText()
                ->key("chip-{$index}")
                ->value($chips[$index])
                ->style('chip')
                ->finish(),
            array_keys($chips),
        );

        return new self($key, $label, $help, LayoutPartData::build()
            ->asBox()
            ->key($key)
            ->style('row')
            ->children(...$parts)
            ->finish(), true);
    }

    public function inBlock(): self
    {
        return clone ($this, ['isBlock' => true]);
    }

    public function changed(): self
    {
        return clone ($this, ['isChanged' => true]);
    }

    public function part(): LayoutPartData
    {
        $parts = [LayoutPartData::build()->asText()->key('title')->value($this->label)->finish()];

        if ($this->help !== null) {
            $parts[] = LayoutPartData::build()
                ->asText()
                ->key('hint')
                ->value($this->help)
                ->style('muted')
                ->finish();
        }

        $parts[] = $this->control;

        if ($this->isChanged) {
            $parts[] = LayoutPartData::build()->asBadge()->key('changed')->text('Not the default')->finish();
        }

        return LayoutPartData::build()
            ->asBox()
            ->key("row-{$this->key}")
            ->style($this->isBlock ? 'setting-block' : 'setting')
            ->children(...$parts)
            ->finish();
    }
}
