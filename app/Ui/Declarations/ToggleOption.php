<?php

declare(strict_types=1);

namespace App\Ui\Declarations;

use App\Ui\Contracts\PageOption;

/**
 * A pane menu option that is on or off, starting in the given position.
 */
final readonly class ToggleOption implements PageOption
{
    private function __construct(
        public string $key,
        public string $label,
        public bool $startsOn,
    ) {}

    public static function make(string $key, string $label, bool $startsOn = false): self
    {
        return new self($key, $label, $startsOn);
    }

    public function key(): string
    {
        return $this->key;
    }

    public function label(): string
    {
        return $this->label;
    }
}
