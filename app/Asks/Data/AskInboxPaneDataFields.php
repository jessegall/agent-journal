<?php

declare(strict_types=1);

namespace App\Asks\Data;

use App\Web\Creation\Exceptions\MissingFields;

final class AskInboxPaneDataFields
{
    /** @var list<AskPreviewData> */
    private array $items;

    private string $inboxUrl;

    /** @param list<AskPreviewData> $items */
    public function items(array $items): self
    {
        $this->items = $items;

        return $this;
    }

    public function inboxUrl(string $inboxUrl): self
    {
        $this->inboxUrl = $inboxUrl;

        return $this;
    }

    public function finish(): AskInboxPaneData
    {
        if (! isset($this->items)) {
            throw MissingFields::forType(AskInboxPaneData::class, 'items');
        }

        if (! isset($this->inboxUrl)) {
            throw MissingFields::forType(AskInboxPaneData::class, 'inboxUrl');
        }

        return new AskInboxPaneData(
            items: $this->items,
            inboxUrl: $this->inboxUrl,
        );
    }
}
