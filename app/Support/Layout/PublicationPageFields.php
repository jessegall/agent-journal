<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Connections\Layout\LayoutBodyData;
use App\Web\Creation\Exceptions\MissingFields;
use Closure;

final class PublicationPageFields
{
    private string $title;

    /** @var list<LayoutPartData> */
    private array $metadata;

    private string $summary;

    /** @var Closure(): LayoutBodyData */
    private Closure $body;

    /** @var list<PublicationTab> */
    private array $tabs;

    /** @var list<LayoutPartData> */
    private array $standing = [];

    public function title(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    /** @param list<LayoutPartData> $metadata */
    public function metadata(array $metadata): self
    {
        $this->metadata = $metadata;

        return $this;
    }

    public function summary(string $summary): self
    {
        $this->summary = $summary;

        return $this;
    }

    /** @param Closure(): LayoutBodyData $body */
    public function body(Closure $body): self
    {
        $this->body = $body;

        return $this;
    }

    /** @param list<PublicationTab> $tabs */
    public function tabs(array $tabs): self
    {
        $this->tabs = $tabs;

        return $this;
    }

    /** @param list<LayoutPartData> $standing */
    public function standing(array $standing): self
    {
        $this->standing = $standing;

        return $this;
    }

    public function finish(): PublicationPage
    {
        if (! isset($this->title)) {
            throw MissingFields::forType(PublicationPage::class, 'title');
        }

        if (! isset($this->metadata)) {
            throw MissingFields::forType(PublicationPage::class, 'metadata');
        }

        if (! isset($this->summary)) {
            throw MissingFields::forType(PublicationPage::class, 'summary');
        }

        if (! isset($this->body)) {
            throw MissingFields::forType(PublicationPage::class, 'body');
        }

        if (! isset($this->tabs)) {
            throw MissingFields::forType(PublicationPage::class, 'tabs');
        }

        return new PublicationPage(
            title: $this->title,
            metadata: $this->metadata,
            summary: $this->summary,
            body: $this->body,
            tabs: $this->tabs,
            standing: $this->standing,
        );
    }
}
