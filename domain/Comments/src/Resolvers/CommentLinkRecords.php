<?php

declare(strict_types=1);

namespace Domain\Comments\Resolvers;

use App\Data\Pages\RecordCard;
use App\Exceptions\RecordUnavailable;
use App\Records\Contracts\RecordProvider;
use App\Records\Contracts\RecordResolver;
use App\Support\RecordIdentity;
use Domain\Comments\Models\Comment;
use Illuminate\Container\Attributes\Scoped;
use Illuminate\Support\Str;

/**
 * Comments as linkable records, readable when their record is: a batch of cards reads the targets in one query,
 * authorizes each once through its own provider, and reads text only where the caller may read. A missing comment and a
 * hidden one look the same.
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
            RecordUnavailable::throwing()->forActor($record),
        );

        $this->records->requireReadable($comment->target);

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
                    ->map(fn (Comment $comment) => $comment->target)
                    ->unique(fn (RecordIdentity $target) => $target->type.' '.$target->id)
                    ->all(),
            ),
        ) as $card) {
            $visibleTargets["{$card->type} {$card->id}"] = $card;
        }

        $shown = $targets->filter(
            fn (Comment $comment) => isset($visibleTargets[$comment->target_type.' '.$comment->target_id]),
        )->pluck('id')->all();

        $comments = Comment::query()
            ->whereKey($shown)
            ->with('anchor')
            ->readExactly(max(1, count($shown)))
            ->get()
            ->keyBy('id');

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
            'type' => Comment::linkType(),
            'id' => $comment->id,
            'number' => '',
            'label' => "comment on {$target->label}",
            'title' => "{$comment->author_type} {$comment->author_id} · {$comment->place_label}",
            'abstract' => Str::limit($comment->body, self::EXCERPT_CHARACTERS),
            'route' => $target->route,
        ]);
    }
}
