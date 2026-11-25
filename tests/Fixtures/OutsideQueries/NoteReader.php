<?php

declare(strict_types=1);

namespace Tests\Fixtures\OutsideQueries;

/**
 * Reads notes from outside their model: through scopes and a key read, which pass, and with a where and an orderBy,
 * which are refused.
 */
final readonly class NoteReader
{
    public function scoped(string $author): Note|null
    {
        return Note::query()->byAuthor($author)->newestFirst()->first();
    }

    public function byKey(int $id): Note
    {
        return Note::query()->whereKey($id)->lockForUpdate()->firstOrFail();
    }

    public function filtered(string $author): Note|null
    {
        return Note::query()->where('author', $author)->first();
    }

    public function ordered(string $author): Note|null
    {
        return Note::query()->byAuthor($author)->orderBy('id')->first();
    }
}
