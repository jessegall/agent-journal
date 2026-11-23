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
        return new self($key, $label, $help, LayoutPartData::field($key, $label, $field, $style));
    }

    /**
     * A row with a read-only value.
     */
    public static function value(string $key, string $label, string $value, string|null $help = null): self
    {
        return new self($key, $label, $help, LayoutPartData::text($key, $value));
    }

    /**
     * A row with a read-only value in declared code text, such as a path or a script, drawn as a block.
     */
    public static function code(string $key, string $label, string $value, string|null $help = null): self
    {
        return new self($key, $label, $help, LayoutPartData::text($key, $value, 'code'), true);
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
            fn (int $index) => LayoutPartData::text("chip-{$index}", $chips[$index], 'chip'),
            array_keys($chips),
        );

        return new self($key, $label, $help, LayoutPartData::box($key, 'row', ...$parts), true);
    }

    public function inBlock(): self
    {
        return new self($this->key, $this->label, $this->help, $this->control, true, $this->isChanged);
    }

    public function changed(): self
    {
        return new self($this->key, $this->label, $this->help, $this->control, $this->isBlock, true);
    }

    public function part(): LayoutPartData
    {
        $parts = [LayoutPartData::text('title', $this->label)];

        if ($this->help !== null) {
            $parts[] = LayoutPartData::text('hint', $this->help, 'muted');
        }

        $parts[] = $this->control;

        if ($this->isChanged) {
            $parts[] = LayoutPartData::badge('changed', 'Not the default');
        }

        return LayoutPartData::box("row-{$this->key}", $this->isBlock ? 'setting-block' : 'setting', ...$parts);
    }
}
