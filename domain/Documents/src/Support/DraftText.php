<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Text\Support\MarkdownText;
use Domain\Documents\Models\DocumentDraft;

/**
 * The whole text of a draft: its title, abstract and checked body.
 */
final readonly class DraftText
{
    public function __construct(public string $title, public string $abstract, public MarkdownText $body) {}

    public static function of(DocumentDraft $draft): self
    {
        return new self($draft->title, $draft->abstract, MarkdownText::body($draft->body));
    }

    public function withBody(MarkdownText $body): self
    {
        return new self($this->title, $this->abstract, $body);
    }

    public function withSectionReplaced(string $numberOrHeading, string $body): self
    {
        return $this->withBody($this->body->withNamedSectionReplaced($numberOrHeading, $body));
    }

    public function withDetails(string $title, string $abstract): self
    {
        return new self(RecordFields::title($title), RecordFields::abstract($abstract), $this->body);
    }
}
