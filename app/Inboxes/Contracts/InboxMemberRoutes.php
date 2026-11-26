<?php

declare(strict_types=1);

namespace App\Inboxes\Contracts;

/**
 * The routes a user admitted to inboxes, who is not the owner, may open: each part adds the routes of its own pages.
 */
interface InboxMemberRoutes
{
    /**
     * Opens every route whose name starts with the prefix to inbox members.
     */
    public function open(string $namePrefix): void;

    /**
     * Whether an inbox member may open the route of this name.
     */
    public function admits(string $routeName): bool;
}
