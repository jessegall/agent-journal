<?php

declare(strict_types=1);

namespace App\Mcp\Data;

use App\Text\Support\TextPreview;

final readonly class SearchHit
{
    private function __construct(
        public string $type,
        public string $id,
        public string $title,
        public string $excerpt,
    ) {}

    public static function matching(string $type, string $id, string $title, string $text, string $query): self
    {
        $match = mb_stripos($text, $query);
        $start = $match === false ? 0 : max(0, $match - 35);
        $excerpt = mb_substr($text, $start, 200);

        return new self($type, $id, self::preview($title, 80), self::preview($excerpt, 160));
    }

    /**
     * @return array{type: string, id: string, title: string, excerpt: string}
     */
    public function card(): array
    {
        return ['type' => $this->type, 'id' => $this->id, 'title' => $this->title, 'excerpt' => $this->excerpt];
    }

    private static function preview(string $text, int $bytes): string
    {
        $words = preg_replace('/[\p{C}\s]+/u', ' ', $text);

        return TextPreview::within((string) $words, $bytes);
    }
}
