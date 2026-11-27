<?php

declare(strict_types=1);

namespace Domain\Comments;

use App\Access\Contracts\PolicyProvider;
use App\Access\Values\PolicyDefinition;
use App\Agents\Drivers\Contracts\NativePartProvider;
use App\Agents\Enums\AccessType;
use App\Bus\Contracts\CommandProvider;
use App\Concerns\HasLinkRecords;
use App\Records\Contracts\LinkRecordProvider;
use App\Records\Contracts\ShareRecordContributor;
use App\Records\Values\ShareRecordDefinition;
use App\Support\Codebase;
use App\Support\Command;
use App\Support\Domain;
use App\Support\Exports;
use Domain\Chat\ChatDomain;
use Domain\Comments\Api\ListCommentsPayload;
use Domain\Comments\Commands\PostComment\PostCommentCommand;
use Domain\Comments\Commands\PostTextComment\PostTextCommentCommand;
use Domain\Comments\Contracts\CommentResolver;
use Domain\Comments\Contracts\PublicCommentResolver;
use Domain\Comments\Data\CommentDetails;
use Domain\Comments\Data\CommentList;
use Domain\Comments\Data\RecordCommentLocation;
use Domain\Comments\Data\RecordCommentsPartData;
use Domain\Comments\Data\RecordCommentView;
use Domain\Comments\Data\RecordReadsData;
use Domain\Comments\Data\TextCommentLocation;
use Domain\Comments\Data\TextCommentView;
use Domain\Comments\Enums\CommentType;
use Domain\Comments\Enums\WholeRecord;
use Domain\Comments\Events\CommentPosted;
use Domain\Comments\Models\Comment;
use Domain\Comments\Policies\CommentPolicy;
use Domain\Comments\Resolvers\CommentLinkRecords;
use Domain\Comments\Support\CommentShareProvider;
use Domain\Comments\Support\PublicComment;
use Domain\Comments\Support\PublicCommentPage;

final class CommentsDomain extends Domain implements
    CommandProvider,
    LinkRecordProvider,
    NativePartProvider,
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
        return [
            ChatDomain::class,
        ];
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
                PublicCommentPage::class,
                CommentType::class,
                CommentPolicy::class,
                ListCommentsPayload::class,
                RecordReadsData::class,
                RecordCommentsPartData::class,
            )
            ->build();
    }

    /**
     * The native part a record page mounts for its comments.
     *
     * @return list<string>
     */
    public function nativeParts(): array
    {
        return ['RecordComments.vue'];
    }

    public function commands(): array
    {
        return Codebase::in(__DIR__.'/Commands/*', Command::class);
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
