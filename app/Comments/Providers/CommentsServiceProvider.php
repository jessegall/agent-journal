<?php

declare(strict_types=1);

namespace App\Comments\Providers;

use App\Comments\Console\CommentListCommand;
use App\Comments\Console\CommentLocationCommand;
use App\Comments\Console\CommentPostCommand;
use App\Comments\Models\Comment;
use App\Comments\Readers\CommentLinkRecords;
use App\Comments\Support\CommentShareProvider;
use App\Records\Contracts\RecordProviderRegistration;
use App\Sharing\Support\ShareRecordRegistration;
use App\Sharing\Support\ShareRecordRegistry;
use Illuminate\Support\ServiceProvider;

/**
 * Core's comments: the comment record any Commentable model collects, read and written through Core contracts, and
 * their routes for signed agents and signed-in users. Comments are registered for sharing as children of a parent
 * only.
 */
final class CommentsServiceProvider extends ServiceProvider
{
    public function boot(RecordProviderRegistration $records, ShareRecordRegistry $shares): void
    {
        $records->register(Comment::LINK_TYPE, CommentLinkRecords::class);
        $shares->register(new ShareRecordRegistration(Comment::LINK_TYPE, Comment::class, CommentShareProvider::class, [CommentShareProvider::CAPABILITY]));
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/comments.php');

        if ($this->app->runningInConsole()) {
            $this->commands([CommentPostCommand::class, CommentListCommand::class, CommentLocationCommand::class]);
        }
    }
}
