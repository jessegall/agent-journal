<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Data;

use App\Web\Creation\Exceptions\MissingFields;

final class CollectionPageDataFields
{
    private string $collection;

    /** @var list<string> */
    private array $texts;

    public function collection(string $collection): self
    {
        $this->collection = $collection;

        return $this;
    }

    /** @param list<string> $texts */
    public function texts(array $texts): self
    {
        $this->texts = $texts;

        return $this;
    }

    public function finish(): CollectionPageData
    {
        if (! isset($this->collection)) {
            throw MissingFields::forType(CollectionPageData::class, 'collection');
        }

        if (! isset($this->texts)) {
            throw MissingFields::forType(CollectionPageData::class, 'texts');
        }

        return new CollectionPageData(
            collection: $this->collection,
            texts: $this->texts,
        );
    }
}
