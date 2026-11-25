<?php

declare(strict_types=1);

namespace App\Providers;

use App\Concerns\LoadsCoreRoutes;
use App\Console\Commands\CommentListCommand;
use App\Console\Commands\CommentLocationCommand;
use App\Console\Commands\CommentPostCommand;
use App\Contracts\Authorization\PolicyCatalogue;
use App\Contracts\Records\CommentResolver;
use App\Contracts\Records\PublicCommentResolver;
use App\Contracts\Records\RecordProviderRegistration;
use App\Enums\AccessType;
use App\Models\Records\Comment;
use App\Policies\CommentPolicy;
use App\Resolvers\CommentLinkRecords;
use App\Resolvers\CommentRecords;
use App\Resolvers\PublicComments;
use App\Support\CommentShareProvider;
use App\Support\ShareRecordDefinition;
use App\Support\ShareRecordRegistry;
use App\Values\PolicyDefinition;
use Illuminate\Support\ServiceProvider;

/**
 * Core's comments: the comment record any Commentable model collects, read and written through Core contracts, and
 * their routes for signed agents and signed-in users. Comments are registered for sharing as children of a parent
 * only.
 */
final class CommentsServiceProvider extends ServiceProvider
{
    use LoadsCoreRoutes;

    public function register(): void
    {
        $this->app->bind(CommentResolver::class, CommentRecords::class);
        $this->app->bind(PublicCommentResolver::class, PublicComments::class);
    }

    public function boot(
        RecordProviderRegistration $records,
        ShareRecordRegistry $shares,
        PolicyCatalogue $policies,
    ): void {
        $policies->register(
            'Core',
            new PolicyDefinition(CommentPolicy::class, [AccessType::Create]),
        );

        $records->register(Comment::LINK_TYPE, CommentLinkRecords::class);

        $shares->register(
            new ShareRecordDefinition(
                Comment::LINK_TYPE,
                Comment::class,
                CommentShareProvider::class,
                [CommentShareProvider::CAPABILITY],
            ),
        );

        $this->loadCoreRoutes('comments/comments.php');

        if ($this->app->runningInConsole()) {
            $this->commands([
                CommentPostCommand::class,
                CommentListCommand::class,
                CommentLocationCommand::class,
            ]);
        }
    }
}
