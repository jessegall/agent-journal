<?php

declare(strict_types=1);

namespace Domain\Comments;

use App\Concerns\HasLinkRecords;
use App\Contracts\Authorization\PolicyProvider;
use App\Contracts\Bus\CommandProvider;
use App\Contracts\Records\LinkRecordProvider;
use App\Contracts\Sharing\ShareRecordContributor;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use App\Support\Domain;
use App\Support\Exports;
use App\Support\FolderClasses;
use App\Support\ShareRecordDefinition;
use App\Values\PolicyDefinition;
use Domain\Comments\Commands\PostComment\PostCommentCommand;
use Domain\Comments\Commands\PostTextComment\PostTextCommentCommand;
use Domain\Comments\Contracts\CommentResolver;
use Domain\Comments\Contracts\PublicCommentResolver;
use Domain\Comments\Data\CommentDetails;
use Domain\Comments\Data\CommentList;
use Domain\Comments\Data\RecordCommentLocation;
use Domain\Comments\Data\RecordCommentView;
use Domain\Comments\Data\TextCommentLocation;
use Domain\Comments\Data\TextCommentView;
use Domain\Comments\Enums\WholeRecord;
use Domain\Comments\Events\CommentPosted;
use Domain\Comments\Models\Comment;
use Domain\Comments\Policies\CommentPolicy;
use Domain\Comments\Resolvers\CommentLinkRecords;
use Domain\Comments\Support\CommentShareProvider;
use Domain\Comments\Support\PublicComment;

final class CommentsDomain extends Domain implements
    CommandProvider,
    LinkRecordProvider,
    PolicyProvider,
    ShareRecordContributor
{
    use HasLinkRecords;

    public function description(): string
    {
        return 'Comments on a record, on the whole of it or on lines of one version of its text, and their public pages.';
    }

    /**
     * @return list<class-string<Domain>>
     */
    public function requires(): array
    {
        return [];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->commands(PostCommentCommand::class, PostTextCommentCommand::class)
            ->events(CommentPosted::class)
            ->contracts(CommentResolver::class, PublicCommentResolver::class)
            ->values(
                CommentDetails::class,
                CommentList::class,
                RecordCommentLocation::class,
                RecordCommentView::class,
                TextCommentLocation::class,
                TextCommentView::class,
                WholeRecord::class,
                PublicComment::class,
            )
            ->build();
    }

    public function commands(): array
    {
        return FolderClasses::in(__DIR__.'/Commands/*', Command::class);
    }

    public function linkRecords(): array
    {
        return [Comment::linkType() => CommentLinkRecords::class];
    }

    public function policies(): array
    {
        return [new PolicyDefinition(CommentPolicy::class, [AccessType::Create])];
    }

    public function shareRecords(): array
    {
        return [
            new ShareRecordDefinition(
                Comment::linkType(),
                Comment::class,
                CommentShareProvider::class,
                [CommentShareProvider::CAPABILITY],
            ),
        ];
    }
}
