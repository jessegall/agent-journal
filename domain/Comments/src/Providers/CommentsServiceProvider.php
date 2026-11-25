<?php

declare(strict_types=1);

namespace Domain\Comments\Providers;

use App\Contracts\Projects\FileComments;
use App\Contracts\Projects\HeldFileVersions;
use App\Support\FolderClasses;
use Domain\Comments\Support\CommentedFileVersions;
use Domain\Comments\Support\FileCommentThreads;
use Domain\Comments\Contracts\CommentResolver;
use Domain\Comments\Contracts\PublicCommentResolver;
use Domain\Comments\Resolvers\CommentRecords;
use Domain\Comments\Resolvers\PublicComments;
use Illuminate\Console\Command;
use Illuminate\Support\ServiceProvider;

/**
 * Binds the comment readers and loads the comment routes and console commands.
 */
final class CommentsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(CommentResolver::class, CommentRecords::class);
        $this->app->bind(PublicCommentResolver::class, PublicComments::class);
        $this->app->bind(FileComments::class, FileCommentThreads::class);
        $this->app->bind(HeldFileVersions::class, CommentedFileVersions::class);
    }

    public function boot(): void
    {
        $this->loadRoutesFrom(dirname(__DIR__, 2).'/routes/comments.php');
        $this->commands(FolderClasses::in(dirname(__DIR__).'/Console/Commands', Command::class));
    }
}
