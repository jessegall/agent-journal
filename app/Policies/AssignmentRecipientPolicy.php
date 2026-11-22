<?php

declare(strict_types=1);

namespace App\Policies;

use App\Contracts\Authorization\Policy;
use App\Enums\AccessType;
use App\Models\AssignmentRecord;
use App\Support\AssigneeIdentity;

/**
 * Who may hold assigned work: an actor may take work itself; handing work to another and clearing a holder are a
 * coordinator's.
 */
final readonly class AssignmentRecipientPolicy implements Policy
{
    public static function model(): string
    {
        return AssignmentRecord::class;
    }

    /**
     * The access a change of holder asks for: taking the work oneself, handing it to another, or clearing it.
     */
    public static function accessFor(AssigneeIdentity $caller, AssigneeIdentity|null $recipient): AccessType
    {
        return match (true) {
            $recipient === null => AccessType::Delete,
            $recipient->isSameAs($caller) => AccessType::Create,
            default => AccessType::Delegate,
        };
    }
}
