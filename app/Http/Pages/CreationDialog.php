<?php

declare(strict_types=1);

namespace App\Http\Pages;

use App\Support\Layout\LayoutWaysData;
use Spatie\LaravelData\Optional;

/**
 * The words of a creation dialog: its key, title, what it says once the record is made, the send label, and the noun
 * an agent can draft with the two ways it offers, left out when no agent can draft it.
 */
final readonly class CreationDialog
{
    public function __construct(
        public string $key,
        public string $title,
        public string $confirmation,
        public string $sendLabel,
        public string|Optional $guidedNoun = new Optional(),
        public string $plainWay = 'Write it yourself',
        public string $guidedWay = 'Write it with an agent',
        public bool $waysInHeader = false,
    ) {}

    /**
     * The two ways the dialog offers when an agent can draft the record, and none when it cannot.
     */
    public function ways(): LayoutWaysData|Optional
    {
        if ($this->guidedNoun instanceof Optional) {
            return Optional::create();
        }

        return new LayoutWaysData($this->plainWay, $this->guidedWay, $this->waysInHeader);
    }
}
