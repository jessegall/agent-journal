<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Data;

use App\Web\Creation\Exceptions\MissingFields;

final class NotesPageDataFields
{
    /** @var list<string> */
    private array $texts;

    /** @param list<string> $texts */
    public function texts(array $texts): self
    {
        $this->texts = $texts;

        return $this;
    }

    public function finish(): NotesPageData
    {
        if (! isset($this->texts)) {
            throw MissingFields::forType(NotesPageData::class, 'texts');
        }

        return new NotesPageData(
            texts: $this->texts,
        );
    }
}
