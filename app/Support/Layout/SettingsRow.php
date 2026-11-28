<?php

declare(strict_types=1);

namespace App\Support\Layout;

/**
 * One setting of a group: its label and help, a changed flag, and either one form field or a read-only value; a block
 * row puts its value below the label, for chips, code and long paths that wrap.
 */
final readonly class SettingsRow
{
    /** @use \App\Web\Creation\Buildable<SettingsRowFields> */
    use \App\Web\Creation\Buildable;

    protected const string FIELDS = SettingsRowFields::class;

    public function __construct(
        private string $key,
        private string $label,
        private string|null $help,
        private LayoutPartData $control,
        private bool $isBlock = false,
        private bool $isChanged = false,
    ) {}

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
