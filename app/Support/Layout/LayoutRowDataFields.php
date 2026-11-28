<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Navigation\Layout\LayoutMenuData;
use App\Web\Creation\Exceptions\MissingFields;
use Spatie\LaravelData\Optional;

final class LayoutRowDataFields
{
    private string $key;

    private string $label;

    private string $value = '';

    /** @var array<string, string> */
    private array $query = [];

    private bool $isCurrent = false;

    private string|Optional $detail;

    private string|Optional $href;

    private LayoutMenuData|Optional $menu;

    /** @var list<LayoutPartData>|Optional */
    private array|Optional $leading;

    /** @var list<LayoutPartData>|Optional */
    private array|Optional $trailing;

    private LayoutFactValueData|Optional $fact;

    private bool $hasColumns = false;

    public function __construct()
    {
        $this->detail = new Optional();
        $this->href = new Optional();
        $this->menu = new Optional();
        $this->leading = new Optional();
        $this->trailing = new Optional();
        $this->fact = new Optional();
    }

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

    public function value(string $value): self
    {
        $this->value = $value;

        return $this;
    }

    /** @param array<string, string> $query */
    public function query(array $query): self
    {
        $this->query = $query;

        return $this;
    }

    public function isCurrent(bool $isCurrent): self
    {
        $this->isCurrent = $isCurrent;

        return $this;
    }

    public function detail(string|Optional $detail): self
    {
        $this->detail = $detail;

        return $this;
    }

    public function href(string|Optional $href): self
    {
        $this->href = $href;

        return $this;
    }

    public function menu(LayoutMenuData|Optional $menu): self
    {
        $this->menu = $menu;

        return $this;
    }

    /** @param list<LayoutPartData>|Optional $leading */
    public function leading(array|Optional $leading): self
    {
        $this->leading = $leading;

        return $this;
    }

    /** @param list<LayoutPartData>|Optional $trailing */
    public function trailing(array|Optional $trailing): self
    {
        $this->trailing = $trailing;

        return $this;
    }

    public function fact(LayoutFactValueData|Optional $fact): self
    {
        $this->fact = $fact;

        return $this;
    }

    public function hasColumns(bool $hasColumns): self
    {
        $this->hasColumns = $hasColumns;

        return $this;
    }

    public function finish(): LayoutRowData
    {
        if (! isset($this->key)) {
            throw MissingFields::forType(LayoutRowData::class, 'key');
        }

        if (! isset($this->label)) {
            throw MissingFields::forType(LayoutRowData::class, 'label');
        }

        return new LayoutRowData(
            key: $this->key,
            label: $this->label,
            value: $this->value,
            query: $this->query,
            isCurrent: $this->isCurrent,
            detail: $this->detail,
            href: $this->href,
            menu: $this->menu,
            leading: $this->leading,
            trailing: $this->trailing,
            fact: $this->fact,
            hasColumns: $this->hasColumns,
        );
    }
}
