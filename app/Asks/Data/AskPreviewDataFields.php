<?php

declare(strict_types=1);

namespace App\Asks\Data;

use App\Web\Creation\Exceptions\MissingFields;

final class AskPreviewDataFields
{
    private string $id;

    private string $excerpt;

    private bool $isOpen;

    public function id(string $id): self
    {
        $this->id = $id;

        return $this;
    }

    public function excerpt(string $excerpt): self
    {
        $this->excerpt = $excerpt;

        return $this;
    }

    public function isOpen(bool $isOpen): self
    {
        $this->isOpen = $isOpen;

        return $this;
    }

    public function finish(): AskPreviewData
    {
        if (! isset($this->id)) {
            throw MissingFields::forType(AskPreviewData::class, 'id');
        }

        if (! isset($this->excerpt)) {
            throw MissingFields::forType(AskPreviewData::class, 'excerpt');
        }

        if (! isset($this->isOpen)) {
            throw MissingFields::forType(AskPreviewData::class, 'isOpen');
        }

        return new AskPreviewData(
            id: $this->id,
            excerpt: $this->excerpt,
            isOpen: $this->isOpen,
        );
    }
}
