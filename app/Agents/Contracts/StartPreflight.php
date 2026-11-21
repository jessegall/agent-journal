<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Agents\Enums\StartPreflightRefusal;
use App\Agents\Exceptions\StartPreflightRefused;
use App\Agents\Values\StartProposal;

/**
 * Whether a proposed start can run, answered before anything stops or a grant is allocated; admission, Switch and
 * Home ask it alike.
 */
interface StartPreflight
{
    /**
     * Every reason the proposal cannot start, none when it can.
     *
     * @return list<StartPreflightRefusal>
     */
    public function refusals(StartProposal $proposal): array;

    /**
     * @throws StartPreflightRefused
     */
    public function assertAdmitted(StartProposal $proposal): void;
}
