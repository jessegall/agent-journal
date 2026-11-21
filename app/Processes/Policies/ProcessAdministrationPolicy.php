<?php

declare(strict_types=1);

namespace App\Processes\Policies;

use App\Actors\Contracts\OwnerPolicy;
use App\Processes\Models\CommandRequest;

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
