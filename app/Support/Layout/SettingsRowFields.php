<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Web\Creation\Exceptions\MissingFields;
use Closure;

final class SettingsRowFields
{
    private string $key;

    private string $label;

    private string|null $help = null;

    /** @var LayoutPartData|(Closure(string, string): LayoutPartData) */
    private LayoutPartData|Closure $control;

    private bool $isBlock = false;

    private bool $isChanged = false;

    public function key(string $key): self
    {
        $this->key = $key;

        return $this;
    }

    public function label(string $label): self
    {
        $this->label = $label;

        return $this;
    }

    public function help(string|null $help): self
    {
        $this->help = $help;

        return $this;
    }

    public function control(LayoutPartData $control): self
    {
        $this->control = $control;

        return $this;
    }

    public function field(LayoutFieldData $field, string $style = 'text'): self
    {
        $this->control = static fn (string $key, string $label): LayoutPartData => LayoutPartData::build()
            ->asField()
            ->key($key)
            ->label($label)
            ->field($field)
            ->style($style)
            ->finish();

        return $this;
    }

    public function value(string $value): self
    {
        $this->control = static fn (string $key): LayoutPartData => LayoutPartData::build()
            ->asText()
            ->key($key)
            ->value($value)
            ->finish();

        return $this;
    }

    public function code(string $code): self
    {
        $this->control = static fn (string $key): LayoutPartData => LayoutPartData::build()
            ->asText()
            ->key($key)
            ->value($code)
            ->style('code')
            ->finish();

        return $this->isBlock(true);
    }

    /** @param list<string> $chips */
    public function chips(array $chips): self
    {
        $this->control = static function (string $key) use ($chips): LayoutPartData {
            $parts = [];

            foreach ($chips as $index => $chip) {
                $parts[] = LayoutPartData::build()->asText()->key("chip-{$index}")->value($chip)->style('chip')->finish();
            }

            return LayoutPartData::build()->asBox()->key($key)->style('row')->children(...$parts)->finish();
        };

        return $this->isBlock(true);
    }

    public function isBlock(bool $isBlock): self
    {
        $this->isBlock = $isBlock;

        return $this;
    }

    public function isChanged(bool $isChanged): self
    {
        $this->isChanged = $isChanged;

        return $this;
    }

    public function finish(): SettingsRow
    {
        if (! isset($this->key)) {
            throw MissingFields::forType(SettingsRow::class, 'key');
        }

        if (! isset($this->label)) {
            throw MissingFields::forType(SettingsRow::class, 'label');
        }

        if (! isset($this->control)) {
            throw MissingFields::forType(SettingsRow::class, 'control');
        }

        $control = $this->control instanceof Closure ? ($this->control)($this->key, $this->label) : $this->control;

        return new SettingsRow(
            key: $this->key,
            label: $this->label,
            help: $this->help,
            control: $control,
            isBlock: $this->isBlock,
            isChanged: $this->isChanged,
        );
    }
}
