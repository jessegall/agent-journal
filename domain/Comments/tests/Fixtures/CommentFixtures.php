<?php

declare(strict_types=1);

namespace Domain\Comments\Tests\Fixtures;

use App\Enums\Records\TextAnchorType;
use App\Support\RecordIdentity;
use App\Values\TextRange;
use Domain\Comments\Commands\PostComment\PostCommentCommand;
use Domain\Comments\Commands\PostTextComment\PostTextCommentCommand;
use Domain\Comments\Models\Comment;
use Illuminate\Support\Str;
use PHPUnit\Framework\Assert;
use Tests\Support\Seeding\FixtureAliases;
use Tests\Support\Seeding\TestJournal;

/**
 * Comments named users and agents post on records through the Comments commands, kept by the id each command answered
 * with under the names a test gives them, and asserted with their full target and anchor.
 */
final class CommentFixtures
{
    private readonly FixtureAliases $aliases;

    public function __construct(private readonly TestJournal $journal)
    {
        $this->aliases = new FixtureAliases('CommentFixtures');
    }

    public function recordComment(string $name, RecordIdentity $target, string $author, string $body): self
    {
        $this->aliases->claim($name);
        $id = $this->journal->runAs($author, new PostCommentCommand($target, $body, (string) Str::uuid()));
        $this->aliases->rememberResult($name, $id, Comment::class);

        return $this;
    }

    public function textComment(
        string $name,
        RecordIdentity $target,
        string $author,
        string $body,
        TextRange $range,
    ): self {
        $this->aliases->claim($name);
        $id = $this->journal->runAs($author, new PostTextCommentCommand($target, $body, $range, (string) Str::uuid()));
        $this->aliases->rememberResult($name, $id, Comment::class);

        return $this;
    }

    public function commentCalled(string $name): Comment
    {
        return $this->aliases->model(Comment::class, $name);
    }

    /**
     * The comment sits on the target, anchored so in that version, over these lines.
     *
     * @param  array{int, int}  $lines
     */
    public function assertAnchor(
        string $name,
        RecordIdentity $target,
        TextAnchorType $anchorType,
        string $version,
        array $lines,
    ): self {
        $comment = $this->commentCalled($name);

        Assert::assertSame(
            [
                $target->type,
                $target->id,
                $anchorType->value,
                $version,
                $lines,
            ],
            [
                $comment->target_type,
                $comment->target_id,
                $comment->anchor_type,
                $comment->version_id,
                [
                    $comment->first_line,
                    $comment->last_line,
                ],
            ],
            "The comment {$name} is anchored otherwise.",
        );

        return $this;
    }

    /**
     * The comment holds this body and was written by the named user or agent.
     */
    public function assertComment(string $name, string $author, string $body): self
    {
        $comment = $this->commentCalled($name);
        $writer = $this->journal->actorCalled($author);

        Assert::assertSame(
            [
                $writer->type,
                $writer->id,
                $body,
            ],
            [
                $comment->author_type,
                $comment->author_id,
                $comment->body,
            ],
        );

        return $this;
    }

    public function assertCount(RecordIdentity $target, int $count): self
    {
        $comments = Comment::query()->where('target_type', $target->type)->where('target_id', $target->id)->count();

        Assert::assertSame($count, $comments, "{$target->reference()} holds another number of comments.");

        return $this;
    }
}
