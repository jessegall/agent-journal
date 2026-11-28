<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Web\Creation\Exceptions\MissingFields;

final class SettingsGroupFields
{
    private string $key;

    private string $title;

    private string|null $help = null;

    /** @var list<SettingsRow> */
    private array $rows = [];

    private LayoutFormData|null $save = null;

    private LayoutFormData|null $reset = null;

    private LayoutPartData|null $switch = null;

    private bool $isLeading = false;

    public function key(string $key): self
    {
        $this->key = $key;

        return $this;
    }

    public function title(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function help(string|null $help): self
    {
        $this->help = $help;

        return $this;
    }

    /** @param list<SettingsRow> $rows */
    public function rows(array $rows): self
    {
        $this->rows = $rows;

        return $this;
    }

    public function save(LayoutFormData|null $save): self
    {
        $this->save = $save;

        return $this;
    }

    public function reset(LayoutFormData|null $reset): self
    {
        $this->reset = $reset;

        return $this;
    }

    public function switch(LayoutPartData|null $switch): self
    {
        $this->switch = $switch;

        return $this;
    }

    public function isLeading(bool $isLeading): self
    {
        $this->isLeading = $isLeading;

        return $this;
    }

    public function finish(): SettingsGroup
    {
        if (! isset($this->key)) {
            throw MissingFields::forType(SettingsGroup::class, 'key');
        }

        if (! isset($this->title)) {
            throw MissingFields::forType(SettingsGroup::class, 'title');
        }

        return new SettingsGroup(
            key: $this->key,
            title: $this->title,
            help: $this->help,
            rows: $this->rows,
            save: $this->save,
            reset: $this->reset,
            switch: $this->switch,
            isLeading: $this->isLeading,
        );
    }
}
