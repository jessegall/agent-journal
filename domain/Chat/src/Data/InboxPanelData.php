<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use App\Communication\Data\InboxView;
use App\Communication\Data\MessagePage;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One inbox on the Inbox page: the inbox with its counts and its newest page of messages.
 */
#[TypeScript]
final class InboxPanelData extends Data
{
    public function __construct(
        public readonly InboxView $inbox,
        public readonly MessagePage $page,
    ) {}
}
