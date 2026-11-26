<?php

declare(strict_types=1);

namespace App\Sessions\Contracts;

use App\Sessions\Enums\StartPreflightRefusal;
use App\Sessions\Exceptions\StartPreflightRefused;
use App\Sessions\Values\StartProposal;

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
