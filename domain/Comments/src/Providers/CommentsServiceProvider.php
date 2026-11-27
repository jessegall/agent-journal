<?php

declare(strict_types=1);

namespace Domain\Comments\Providers;

use App\Projects\Contracts\FileComments;
use App\Projects\Contracts\HeldFileVersions;
use App\Support\Codebase;
use Domain\Comments\Contracts\CommentResolver as CommentResolverContract;
use Domain\Comments\Contracts\PublicCommentResolver as PublicCommentResolverContract;
use Domain\Comments\Resolvers\CommentResolver;
use Domain\Comments\Resolvers\PublicCommentResolver;
use Domain\Comments\Support\CommentedFileVersions;
use Domain\Comments\Support\FileCommentThreads;
use Illuminate\Support\ServiceProvider;

/**
 * Binds the comment readers and loads the comment routes and console commands.
 */
final class CommentsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(CommentResolverContract::class, CommentResolver::class);
        $this->app->bind(PublicCommentResolverContract::class, PublicCommentResolver::class);
        $this->app->bind(FileComments::class, FileCommentThreads::class);
        $this->app->bind(HeldFileVersions::class, CommentedFileVersions::class);
    }

    public function boot(): void
    {
        $this->loadRoutesFrom(dirname(__DIR__, 2).'/routes/comments.php');
        $this->commands(Codebase::consoleCommandsIn(dirname(__DIR__)));
    }
}
