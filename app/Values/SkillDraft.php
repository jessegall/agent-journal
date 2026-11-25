<?php

declare(strict_types=1);

namespace App\Values;

/**
 * The content of one stored skill revision as submitted: name, description, sections of literal Markdown and the
 * condition in its JSON wire format, checked when the revision is saved.
 */
final readonly class SkillDraft
{
    /**
     * @param  list<SectionDraft>  $sections
     */
    public function __construct(
        public string $name,
        public string $description,
        public array $sections,
        public string $condition,
    ) {}

    /**
     * The sha256 digest of the whole submitted content, so a retry with other content under one request id is told
     * apart.
     */
    public function digest(): string
    {
        return hash('sha256', (string) json_encode([
            $this->name,
            $this->description,
            array_map(
                fn (SectionDraft $section) => [
                    $section->key,
                    $section->heading,
                    $section->markdown,
                ],
                $this->sections,
            ),
            $this->condition,
        ], JSON_THROW_ON_ERROR));
    }
}
