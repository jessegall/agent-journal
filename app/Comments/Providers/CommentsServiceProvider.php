<?php

declare(strict_types=1);

namespace App\Comments\Providers;

use App\Comments\Console\CommentListCommand;
use App\Comments\Console\CommentLocationCommand;
use App\Comments\Console\CommentPostCommand;
use App\Comments\Models\Comment;
use App\Comments\Readers\CommentLinkRecords;
use App\Records\Contracts\RecordProviderRegistration;
use Illuminate\Support\ServiceProvider;

/**
 * Core's comments: the comment record any Commentable model collects, read and written through Core contracts, and
 * their routes for signed agents and signed-in users.
 */
final class CommentsServiceProvider extends ServiceProvider
{
    public function boot(RecordProviderRegistration $records): void
    {
        $records->register(Comment::LINK_TYPE, CommentLinkRecords::class);
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/comments.php');

        if ($this->app->runningInConsole()) {
            $this->commands([CommentPostCommand::class, CommentListCommand::class, CommentLocationCommand::class]);
        }
    }
}
