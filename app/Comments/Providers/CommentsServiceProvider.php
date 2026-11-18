<?php

declare(strict_types=1);

namespace App\Comments\Providers;

use Illuminate\Support\ServiceProvider;

/**
 * Core's comments: the comment record any Commentable model collects, read and written through Core contracts, and
 * their routes for signed agents and signed-in users.
 */
final class CommentsServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/comments.php');
    }
}
