<?php

declare(strict_types=1);

namespace Domain\Sharing\Support;

/**
 * What one public read returns, fully read before its transaction commits: either a denial, or the record's title,
 * published version and body, the linked records to go on to and a page of its owned children with where the next
 * page starts. A HEAD read carries no body.
 */
final readonly class SharedPage
{
    /**
     * @param  list<SharedPageItem>  $linked
     * @param  list<SharedPageItem>  $children
     */
    public function __construct(
        public bool $isAllowed,
        public string $title,
        public string $publicationVersion,
        public string $body,
        public array $linked,
        public array $children,
        public string|null $nextCursor,
    ) {}

    public static function denied(): self
    {
        return new self(false, '', '', '', [], [], null);
    }
}
