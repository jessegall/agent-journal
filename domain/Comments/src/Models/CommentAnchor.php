<?php

declare(strict_types=1);

namespace Domain\Comments\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Exceptions\IncompleteTextAnchor;
use App\Models\Support\JournalModel;
use App\Records\Contracts\ReadableModel;
use App\Records\Enums\TextAnchorType;
use App\Records\Values\ReadOrder;
use App\Values\TextAnchor;
use Domain\Comments\Exceptions\CommentAnchorCorrupt;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $comment_id
 * @property string $version_id
 * @property string $version_label
 * @property string $anchor_type
 * @property int|null $section_number
 * @property int $first_line
 * @property int $last_line
 * @property string|null $quote
 * @property int|null $start_offset
 * @property int|null $end_offset
 * @property-read Comment $comment
 *
 * @mixin \Eloquent
 */
final class CommentAnchor extends JournalModel implements ReadableModel
{
    use BoundedReads;
    use Linkable;

    public $timestamps = false;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'section_number' => 'integer',
            'first_line' => 'integer',
            'last_line' => 'integer',
            'start_offset' => 'integer',
            'end_offset' => 'integer',
        ];
    }

    public function defaultReadOrder(): ReadOrder
    {
        return ReadOrder::by(['comment_anchors.comment_id'], 'comment_anchors.id');
    }

    // ----------[ Constructors ]----------

    /**
     * The place in one version of a record's text that a comment is about.
     */
    public static function create(Comment $comment, TextAnchor $anchor): self
    {
        $row = new self();
        $row->comment_id = $comment->id;
        $row->version_id = $anchor->versionId;
        $row->version_label = $anchor->versionLabel;
        $row->anchor_type = $anchor->type->value;
        $row->section_number = $anchor->sectionNumber === 0 ? null : $anchor->sectionNumber;
        $row->first_line = $anchor->firstLine;
        $row->last_line = $anchor->lastLine;
        $row->quote = $anchor->quote === '' ? null : $anchor->quote;
        $row->start_offset = $anchor->quote === '' ? null : $anchor->startOffset;
        $row->end_offset = $anchor->quote === '' ? null : $anchor->endOffset;

        $row->save();

        return $row;
    }

    // ----------[ Transformers ]----------

    /**
     * The anchor its columns hold.
     *
     * @throws CommentAnchorCorrupt when a column its type needs is empty
     */
    public function text(): TextAnchor
    {
        $type = $this->assertComplete();
        $isQuote = $type === TextAnchorType::Quote;

        return TextAnchor::restored(
            $this->version_id,
            $this->version_label,
            $type,
            $type === TextAnchorType::Section ? (int) $this->section_number : 0,
            $this->first_line,
            $this->last_line,
            $isQuote ? (string) $this->quote : '',
            $isQuote ? (int) $this->start_offset : 0,
            $isQuote ? (int) $this->end_offset : 0,
        );
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses an anchor with no known type or a column its type needs left empty, as a corrupt comment.
     *
     * @throws CommentAnchorCorrupt
     */
    private function assertComplete(): TextAnchorType
    {
        $type = TextAnchorType::tryFrom($this->anchor_type);

        if ($type === null) {
            throw CommentAnchorCorrupt::for($this->comment_id, IncompleteTextAnchor::withoutType());
        }

        $columns = [];

        if ($type === TextAnchorType::Section) {
            $columns['sectionNumber'] = 'section_number';
        }

        if ($type === TextAnchorType::Quote) {
            $columns = ['quote' => 'quote', 'startOffset' => 'start_offset', 'endOffset' => 'end_offset'];
        }

        foreach ($columns as $field => $name) {
            if ($this->getAttribute($name) === null) {
                throw CommentAnchorCorrupt::for($this->comment_id, IncompleteTextAnchor::missing($type->value, $field));
            }
        }

        return $type;
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<Comment, $this>
     */
    public function comment(): BelongsTo
    {
        return $this->belongsTo(Comment::class);
    }
}
