<?php

declare(strict_types=1);

namespace App\Support;

/**
 * The name an actor may be shown by to anyone who can see its records: never an email or a credential.
 */
final readonly class AssigneeName
{
    public function __construct(
        public AssigneeIdentity $assignee,
        public string $name,
    ) {}

    /**
     * The assignee as a tool lists it: its assignee type, its id and its name.
     *
     * @return array{type: string, id: string, name: string}
     */
    public function listing(): array
    {
        return [
            'type' => $this->assignee->type,
            'id' => $this->assignee->id,
            'name' => $this->name,
        ];
    }
}
