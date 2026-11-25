<?php

declare(strict_types=1);

namespace App\Support;

use App\Exceptions\InvalidAssignmentIdentity;
use Illuminate\Support\Str;

/**
 * One assignment as it was read: its row id and its holder. A command that changes an assignment names the reference
 * it expects, so a stale view is refused instead of overwriting a newer holder.
 */
final readonly class AssignmentReference
{
    /**
     * @throws InvalidAssignmentIdentity
     */
    public function __construct(
        public string $id,
        public AssigneeIdentity $holder,
    ) {
        if (! Str::isUlid($id)) {
            throw InvalidAssignmentIdentity::forReference($id);
        }
    }

    public function isSameAs(self $other): bool
    {
        return $this->id === $other->id && $this->holder->isSameAs($other->holder);
    }

    /**
     * @return array{id: string, holder: array{type: string, id: string}}
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'holder' => [
                'type' => $this->holder->type,
                'id' => $this->holder->id,
            ],
        ];
    }
}
