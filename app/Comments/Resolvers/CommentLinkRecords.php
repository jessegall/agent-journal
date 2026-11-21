<?php

declare(strict_types=1);

namespace App\Comments\Resolvers;

use App\Comments\Models\Comment;
use App\Records\Contracts\RecordProvider;
use App\Records\Contracts\RecordResolver;
use App\Records\Data\RecordCard;
use App\Records\Exceptions\RecordUnavailable;
use App\Records\Support\RecordIdentity;
use Illuminate\Container\Attributes\Scoped;
use Illuminate\Support\Str;

/**
 * Comments as linkable records. A comment is readable when its record is: a batch of cards reads the comments' targets
 * in one query, authorizes each target record once through its own provider, and reads text only for the comments
 * whose record the caller may read. A missing comment and a hidden one look the same. Comments never change, and they
 * have no numbers to name them by.
 */
#[Scoped]
final readonly class CommentLinkRecords implements RecordProvider
{
    private const int EXCERPT_CHARACTERS = 120;

    public function __construct(private RecordResolver $records) {}

    public function referenceWord(): string
    {
        return 'comment';
    }

    public function identityOf(int $number): RecordIdentity
    {
        throw RecordUnavailable::numbered($this->referenceWord(), $number);
    }

    public function card(RecordIdentity $record): RecordCard
    {
        return $this->visibleCards([$record])[0] ?? throw RecordUnavailable::forActor($record);
    }

    public function requireReadable(RecordIdentity $record): Comment
    {
        $comment = Comment::query()->whereKey($record->id)->firstOr(
            fn () => throw RecordUnavailable::forActor($record),
        );

        $this->records->requireReadable($comment->target());

        return $comment;
    }

    public function requireWritable(RecordIdentity $record): Comment
    {
        throw RecordUnavailable::forActor($record);
    }

    public function visibleCards(array $records): array
    {
        $targets = Comment::query()->whereKey(
            array_map(fn (RecordIdentity $record) => $record->id, $records),
        )->readExactly(count($records))->get(['id', 'target_type', 'target_id']);

        $visibleTargets = [];

        foreach ($this->records->visibleCards(
            array_values(
                $targets
                    ->map(fn (Comment $comment) => $comment->target())
                    ->unique(fn (RecordIdentity $target) => $target->type.' '.$target->id)
                    ->all(),
            ),
        ) as $card) {
            $visibleTargets["{$card->type} {$card->id}"] = $card;
        }

        $shown = $targets->filter(
            fn (Comment $comment) => isset($visibleTargets[$comment->target_type.' '.$comment->target_id]),
        )->pluck('id')->all();

        $comments = Comment::query()->whereKey($shown)->readExactly(max(1, count($shown)))->get()->keyBy('id');
        $cards = [];

        foreach ($records as $record) {
            $comment = $comments->get($record->id);

            if ($comment instanceof Comment) {
                $cards[] = self::cardOf($comment, $visibleTargets[$comment->target_type.' '.$comment->target_id]);
            }
        }

        return $cards;
    }

    private static function cardOf(Comment $comment, RecordCard $target): RecordCard
    {
        return RecordCard::from([
            'type' => Comment::LINK_TYPE,
            'id' => $comment->id,
            'number' => '',
            'label' => "comment on {$target->label}",
            'title' => "{$comment->author_type->value} {$comment->author_id} · {$comment->placeLabel()}",
            'abstract' => Str::limit($comment->body, self::EXCERPT_CHARACTERS),
            'route' => $target->route,
        ]);
    }
}
