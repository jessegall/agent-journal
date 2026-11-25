<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Shelves\Listeners;

use Domain\Comments\Events\CommentPosted;

/**
 * A module listening to an event Comments exports, without any change to Comments.
 */
final class CountCommentPosted
{
    public function handle(CommentPosted $event): void {}
}
