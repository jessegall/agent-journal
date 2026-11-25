<?php

declare(strict_types=1);

namespace Tests\Fixtures\Communication;

use App\Contracts\Inboxes\LabeledInbox;

final readonly class TeamInbox implements LabeledInbox
{
    public function __construct(private string $id) {}

    public function inboxId(): string
    {
        return $this->id;
    }
}
