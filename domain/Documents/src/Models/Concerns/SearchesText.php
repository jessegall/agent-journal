<?php

declare(strict_types=1);

namespace Domain\Documents\Models\Concerns;

use App\Queries\Support\TextSearch;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * The literal, case-blind search over a record's title, abstract and body that documents' revisions and reports share.
 */
trait SearchesText
{
    /**
     * Only the rows whose title, abstract or body holds the words.
     *
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function matchingText(Builder $query, string $words): void
    {
        $query->where(fn (Builder $searchableColumns) => $searchableColumns
            ->where(fn (Builder $title) => TextSearch::narrow($title, 'title', $words))
            ->orWhere(fn (Builder $abstract) => TextSearch::narrow($abstract, 'abstract', $words))
            ->orWhere(fn (Builder $body) => TextSearch::narrow($body, 'body', $words)));
    }

    /**
     * A short piece of the text around the first place the words appear: the body first, then the abstract, then
     * the title.
     */
    public function snippetFor(string $words): string
    {
        foreach ([$this->body, $this->abstract, $this->title] as $text) {
            $matchOffset = mb_stripos($text, trim($words));

            if ($matchOffset !== false) {
                $start = max(0, $matchOffset - 60);

                return ($start > 0 ? '…' : '').trim(mb_substr($text, $start, mb_strlen(trim($words)) + 120)).'…';
            }
        }

        return '';
    }
}
