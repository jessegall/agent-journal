<?php

declare(strict_types=1);

namespace App\Ui\Layout;

use App\Ui\Enums\Icon;

/**
 * The shared recipe of a record shown as a card in a list: its icon, title and state badge on one line, the moment it
 * happened, and under them only the actions the server permits, each a registered destination the declaring reader
 * supplies. A domain hands in neutral values and permitted actions only.
 */
final class RecordCard
{
    private string|null $badgeWord = null;

    private string $badgeTone = 'quiet';

    private string|null $momentLabel = null;

    private string|null $moment = null;

    /**
     * @var list<LayoutPartData>
     */
    private array $actions = [];

    private function __construct(
        private readonly string $key,
        private readonly Icon $icon,
        private readonly string $title,
    ) {}

    public static function make(string $key, Icon $icon, string $title): self
    {
        return new self($key, $icon, $title);
    }

    /**
     * The state word of the record in a tone: quiet, good, warn, danger or busy.
     */
    public function withBadge(string $word, string $tone = 'quiet'): self
    {
        $this->badgeWord = $word;
        $this->badgeTone = $tone;

        return $this;
    }

    /**
     * When it happened, as a label and an ISO moment the browser shows in the viewer's own zone.
     */
    public function happened(string $label, string $moment): self
    {
        $this->momentLabel = $label;
        $this->moment = $moment;

        return $this;
    }

    /**
     * The actions the server permits on the record, such as Answer; one the viewer may not take is not given.
     */
    public function withActions(LayoutPartData ...$actions): self
    {
        $this->actions = array_values($actions);

        return $this;
    }

    public function part(): LayoutPartData
    {
        $head = [
            LayoutPartData::text('icon', $this->icon->value, 'icon'),
            LayoutPartData::text('title', $this->title),
        ];

        if ($this->badgeWord !== null) {
            $head[] = LayoutPartData::badge('badge', $this->badgeWord, $this->badgeTone);
        }

        $parts = [LayoutPartData::box('head', 'row', ...$head)];

        if ($this->momentLabel !== null && $this->moment !== null) {
            $parts[] = LayoutPartData::time('time', $this->momentLabel, $this->moment);
        }

        if ($this->actions !== []) {
            $parts[] = LayoutPartData::box('actions', 'row', ...$this->actions);
        }

        return LayoutPartData::box($this->key, 'card', ...$parts);
    }
}
