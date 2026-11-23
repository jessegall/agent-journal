<?php

declare(strict_types=1);

namespace App\Policies;

use App\Contracts\Authorization\OwnerPolicy;
use App\Models\CommandRules\CommandRequest;

/**
 * Who may administer command rules, their requests, approvals and process output: only the owner holds the access, so
 * the grants decide.
 */
final readonly class ProcessAdministrationPolicy implements OwnerPolicy
{
    public static function model(): string
    {
        return CommandRequest::class;
    }
}
