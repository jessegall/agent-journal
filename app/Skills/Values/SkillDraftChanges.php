<?php

declare(strict_types=1);

namespace App\Skills\Values;

/** The fields submitted for a skill revision. An omitted field keeps its current value. */
final readonly class SkillDraftChanges
{
    public function __construct(
        public string|null $name,
        public string|null $description,
        public string|null $body,
        public string|null $condition,
    ) {}

    public function digest(): string
    {
        return hash('sha256', json_encode(
            [$this->name, $this->description, $this->body, $this->condition],
            JSON_THROW_ON_ERROR,
        ));
    }
}
