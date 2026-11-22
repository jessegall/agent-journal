<?php

declare(strict_types=1);

namespace Tests\Fixtures\Communication;

use App\Contracts\Inbox;

final readonly class TeamInbox implements Inbox
{
    public function __construct(private string $id, private string $label) {}

    public function inboxId(): string
    {
        return $this->id;
    }

    public function inboxLabel(): string
    {
        return $this->label;
    }
}
